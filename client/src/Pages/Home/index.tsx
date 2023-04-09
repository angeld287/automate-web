import { MenuUnfoldOutlined, PicRightOutlined } from "@ant-design/icons";
import { Col, Row } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import ContentOrganizationStepper from "../../Components/App/ContentOrganizationStepper";
import DraftArticles from "../../Components/App/DraftArticles";
import { IArticlesActions } from "../../Components/App/DraftArticles/IDraftArticles";
import { getAIResearchedArticles, getArticles, selectArticles } from "../../features/articles/articlesSlice";
import { IArticle } from "../../interfaces/models/Article";
import "./home.css"

const Home = () => {

    const navigate = useNavigate()
    const [ openModal, setOpenModal ] = useState(false);
    const [ article, setAricle ] = useState<IArticle>();

    const {articles, AIArticles, statusAI, page, size, status, hasMore} = useAppSelector(selectArticles);

    const onClickEdit = (article: IArticle) => {
        navigate(`/keywords/${article.internalId}`);
    }

    const goToPrepareContent = (article: IArticle) => {
        setOpenModal(true)
        setAricle(article)
    }

    const articlesActions: IArticlesActions[] = [
        {icon: <PicRightOutlined />, _key: "draft_edit_btn", onClick: onClickEdit}
    ]

    const aiArticlesActions: IArticlesActions[] = [
        {icon: <MenuUnfoldOutlined />, _key: "prepare_content_btn", onClick: goToPrepareContent}
    ]

      
    return (
        <>
            <Row className="rows">
                <Col span={12} className="ai-list">
                    <DraftArticles {...{actions: aiArticlesActions, hasMore: false, status: statusAI, articles: AIArticles, getArticles: getAIResearchedArticles(), getNextArticles: getAIResearchedArticles()}}/>
                </Col>
                <Col span={12} className="home-draft-list">
                    <DraftArticles {...{actions: articlesActions, hasMore, status, articles, getArticles: getArticles({page, size}), getNextArticles: getArticles({page: (page+size), size})}}/>
                </Col>
            </Row>
            <ContentOrganizationStepper {...{open: openModal, setOpen: setOpenModal, article}}/>
        </>
    );
}

export default Home;