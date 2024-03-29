import { DeleteOutlined, GooglePlusOutlined, MenuUnfoldOutlined, PicRightOutlined } from "@ant-design/icons";
import { Col, Row } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import DraftArticles from "../../../../Components/App/DraftArticles";
import { IArticlesActions } from "../../../../Components/App/DraftArticles/IDraftArticles";
import { getArticlesByCategory, selectArticles, updateCategoryArticle } from "../../../../features/articles/articlesSlice";
import { IArticle } from "../../../../interfaces/models/Article";
import CustomLoader from "../../../../Components/CustomLoader";
import ContentOrganizationStepper from "../../../../Components/App/ContentOrganizationStepper";
import { ArticleState } from "../../../../interfaces/Enums/States";
import CustomModal from "../../../../Components/CustomModal";
import { updateArticleState } from "../../../../features/article/articleSlice";
import { setModule } from "../../../../features/userSession/userSessionSlice";

const CategoryArticles = () => {

    const [ openModal, setOpenModal ] = useState(false);
    const [ discardModal, setDiscardModal ] = useState(false);
    const [ article, setAricle ] = useState<IArticle>();
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setModule("seo"))
    }, [])

    let { category } = useParams();

    useEffect(() => {
        if(category)
            dispatch(getArticlesByCategory(category));
    }, [dispatch, category])

    const { CategoryArticles } = useAppSelector(selectArticles);

    const onClickEdit = useCallback((article: IArticle) => {
        if(article.sysState?.trim() !== ArticleState.CONTENT_RESEARCH){
            return null
        }
        window.open(`${window.location.href.replace(window.location.pathname, '')}/site/content-editor/${article.internalId}`, '_blank');
        //navigate(`/content-editor/${article.internalId}`);
    }, [])

    const goToPrepareContent = useCallback((article: IArticle) => {
        if(article.sysState?.trim() !== ArticleState.AI_CONTENT_RESEARCH) return null
        
        setOpenModal(true);
        setAricle(article);
    }, []);

    const setArticleCrawled = useCallback((article: IArticle) => {
        if(article.sysState?.trim() !== ArticleState.CREATED_IN_WP) return null
        
        dispatch(updateArticleState({id: article.id, state: ArticleState.GOOGLE_CRAWLED}))
    }, [dispatch]);

    
    const setDiscardArticle = useCallback((article: IArticle) => {
        if(article.sysState?.trim() === ArticleState.DISCARDED) return null

        setDiscardModal(true);
        setAricle(article);
    }, []);

    const discardArticle = useCallback(() => {
        if(article){
            dispatch(updateArticleState({id: article.id, state: ArticleState.DISCARDED}))
            article.sysState = ArticleState.DISCARDED;
            dispatch(updateCategoryArticle(article));
        }
        setAricle(undefined);
        setDiscardModal(false);
    }, [article, dispatch]);

    const articlesActions: IArticlesActions[] = [
        {icon: <><MenuUnfoldOutlined style={{ fontSize: '16px', color: '#f50' }} /> Organize Content</>, _key: "prepare_content_btn", onClick: goToPrepareContent},
        {icon: <><PicRightOutlined style={{ fontSize: '16px', color: '#cd201f' }} /> Add Images</>, _key: "add_images_btn", onClick: onClickEdit},
        {icon: <><GooglePlusOutlined style={{ fontSize: '16px', color: '#108ee9' }} /> Google Craw </> , _key: "set_craweled_btn", onClick: setArticleCrawled},
        {icon: <><DeleteOutlined style={{ fontSize: '16px', color: 'purple' }} /> Discard </> , _key: "set_discard_btn", onClick: setDiscardArticle},
    ];

    if(category === undefined) return <CustomLoader/>;

    return (
        <Row>
            <Col style={{width: '100%'}}>
                <DraftArticles {...{actions: articlesActions, hasMore: false, status: 'idle', articles: CategoryArticles, getArticles: getArticlesByCategory(category), getNextArticles: getArticlesByCategory(category)}}/>
            </Col>
            <ContentOrganizationStepper {...{open: openModal, setOpen: setOpenModal, article}}/>
            <CustomModal onOk={discardArticle} {...{open: discardModal, setOpen: setDiscardModal, title: "Are you sure you wants to discard the article?"}}>
            </CustomModal>
        </Row>
    );
}

export default CategoryArticles;