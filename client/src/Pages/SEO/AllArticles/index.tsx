import { CopyOutlined, GooglePlusOutlined, MenuUnfoldOutlined, PicRightOutlined, RollbackOutlined } from "@ant-design/icons";
import { Row, Tabs } from "antd";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import ContentOrganizationStepper from "../../../Components/App/ContentOrganizationStepper";
import DraftArticles from "../../../Components/App/DraftArticles";
import { IArticlesActions } from "../../../Components/App/DraftArticles/IDraftArticles";
import { getAIResearchedArticles, getArticles, getWpCreatedArticles, selectArticles } from "../../../features/articles/articlesSlice";
import { updateArticleState } from "../../../features/article/articleSlice";
import { IArticle } from "../../../interfaces/models/Article";
import "./AllArticles.css"
import { ArticleState } from "../../../interfaces/Enums/States";
import CustomModal from "../../../Components/CustomModal";
import { generateArticleLink } from "../../../utils/functions";

const Home = () => {

    const navigate = useNavigate()
    const [ openModal, setOpenModal ] = useState(false);
    const [ confirmGoBack, setConfirmGoBack ] = useState(false);
    const [ article, setAricle ] = useState<IArticle>();
    const dispatch = useAppDispatch();

    const {articles, AIArticles, statusAI, page, size, status, WPArticles} = useAppSelector(selectArticles);

    const onClickEdit = (article: IArticle) => {
        navigate(`/site/content-editor/${article.internalId}`);
    }

    const goToPrepareContent = (article: IArticle) => {
        setOpenModal(true)
        setAricle(article)
    }

    const confirmGetBack = (article: IArticle) => {
        setConfirmGoBack(true)
        setAricle(article)
    }

    const getArticleBack = useCallback((article?: IArticle) => {
        if(article)
            dispatch(updateArticleState({id: article.id, state: ArticleState.KEYWORD_PLANNING}));
    }, [dispatch]);

    const setArticleCrawled = useCallback((article?: IArticle) => {
        if(article)
            dispatch(updateArticleState({id: article.id, state: ArticleState.GOOGLE_CRAWLED}))
    }, [dispatch])

    const copyArticleSlut = useCallback((article: IArticle) => {
        const slut = generateArticleLink(article);
        navigator.clipboard.writeText(slut)
    }, [])

    const articlesActions: IArticlesActions[] = [
        {icon: <PicRightOutlined />, _key: "draft_edit_btn", onClick: onClickEdit}
    ];

    const wpArticlesActions: IArticlesActions[] = [
        {icon: <GooglePlusOutlined />, _key: "wp-g-crewled_btn", onClick: setArticleCrawled},
        {icon: <CopyOutlined />, _key: "wp-copy-link_btn", onClick: copyArticleSlut}
    ]

    const aiArticlesActions: IArticlesActions[] = useMemo(() => [
        {icon: <RollbackOutlined />, _key: "get_article_back_btn", onClick: confirmGetBack},
        {icon: <MenuUnfoldOutlined />, _key: "prepare_content_btn", onClick: goToPrepareContent}
    ], []);

      
    return (
        <>
            <Row>
                Total Articles: {AIArticles.length + articles.length + WPArticles.length}
            </Row>
            <Tabs
                defaultActiveKey="1"
                tabPosition="left"
                onChange={(e) => {
                    dispatch(getAIResearchedArticles())
                    dispatch(getArticles({page, size}))
                    dispatch(getWpCreatedArticles())
                }}
                //style={{ height: 220 }}
                items={[
                    {
                        label: `Researched Articles`,
                        key: '1',
                        children: <DraftArticles {...{actions: aiArticlesActions, hasMore: false, status: statusAI, articles: AIArticles, getArticles: getAIResearchedArticles(), getNextArticles: getAIResearchedArticles()}}/>,
                    },
                    {
                        label: `Content Organized Articles`,
                        key: '2',
                        children: <DraftArticles {...{actions: articlesActions, hasMore: false, status, articles, getArticles: getArticles({page, size}), getNextArticles: getArticles({page: (page+size), size})}}/>,
                    },{
                        label: `Wp Created Articles`,
                        key: '3',
                        children: <DraftArticles {...{actions: wpArticlesActions, hasMore: false, status: statusAI, articles: WPArticles, getArticles: getWpCreatedArticles(), getNextArticles: getWpCreatedArticles()}}/>,
                    },
                ]}
            />
            <ContentOrganizationStepper {...{open: openModal, setOpen: setOpenModal, article}}/>
            <CustomModal title="Are you sure you want to send this article back?" open={confirmGoBack} setOpen={setConfirmGoBack} onOk={() => {getArticleBack(article); setConfirmGoBack(false)}}/>
        </>
    );
}

export default Home;