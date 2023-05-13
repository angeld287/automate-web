import { CopyOutlined, GooglePlusOutlined, MenuUnfoldOutlined, PicRightOutlined, RollbackOutlined } from "@ant-design/icons";
import { Col, Row, Tabs } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import DraftArticles from "../../../Components/App/DraftArticles";
import { IArticlesActions } from "../../../Components/App/DraftArticles/IDraftArticles";
import { getArticlesByCategory, selectArticles } from "../../../features/articles/articlesSlice";
import { IArticle } from "../../../interfaces/models/Article";
import CustomLoader from "../../../Components/CustomLoader";
import ContentOrganizationStepper from "../../../Components/App/ContentOrganizationStepper";
import { ArticleState } from "../../../interfaces/Enums/States";

const CategoryArticles = () => {

    const navigate = useNavigate()
    const [ openModal, setOpenModal ] = useState(false);
    const [ confirmGoBack, setConfirmGoBack ] = useState(false);
    const [ article, setAricle ] = useState<IArticle>();
    const dispatch = useAppDispatch();

    let { category } = useParams();

    useEffect(() => {
        if(category)
            dispatch(getArticlesByCategory(category));
    }, [])

    const { CategoryArticles } = useAppSelector(selectArticles);

    const onClickEdit = (article: IArticle) => {
        if(article.sysState?.trim() !== ArticleState.CONTENT_RESEARCH){
            return null
        }

        navigate(`/content-editor/${article.internalId}`);
    }

    const goToPrepareContent = (article: IArticle) => {
        if(article.sysState?.trim() !== ArticleState.AI_CONTENT_RESEARCH) return null
        
        setOpenModal(true);
        setAricle(article);
    }

    const setArticleCrawled = (article: IArticle) => {
        if(article.sysState?.trim() !== ArticleState.CREATED_IN_WP) return null
    }

    const articlesActions: IArticlesActions[] = [
        {icon: <><MenuUnfoldOutlined style={{ fontSize: '16px', color: '#f50' }} /> Organize Content</>, _key: "prepare_content_btn", onClick: goToPrepareContent},
        {icon: <><PicRightOutlined style={{ fontSize: '16px', color: '#cd201f' }} /> Add Images</>, _key: "add_images_btn", onClick: onClickEdit},
        {icon: <><GooglePlusOutlined style={{ fontSize: '16px', color: '#108ee9' }} /> Google Craw </> , _key: "set_craweled_btn", onClick: setArticleCrawled},
    ];

    if(category === undefined) return <CustomLoader/>;

    return (
        <Row>
            <Col style={{width: '100%'}}>
                <DraftArticles {...{actions: articlesActions, hasMore: false, status: 'idle', articles: CategoryArticles, getArticles: getArticlesByCategory(category), getNextArticles: getArticlesByCategory(category)}}/>
            </Col>
            <ContentOrganizationStepper {...{open: openModal, setOpen: setOpenModal, article}}/>
        </Row>
    );
}

export default CategoryArticles;