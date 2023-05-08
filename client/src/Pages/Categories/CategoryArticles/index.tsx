import { CopyOutlined, GooglePlusOutlined, MenuUnfoldOutlined, PicRightOutlined, RollbackOutlined } from "@ant-design/icons";
import { Col, Row, Tabs } from "antd";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import DraftArticles from "../../../Components/App/DraftArticles";
import { IArticlesActions } from "../../../Components/App/DraftArticles/IDraftArticles";
import { getArticles, selectArticles } from "../../../features/articles/articlesSlice";
import { IArticle } from "../../../interfaces/models/Article";

const CategoryArticles = () => {

    const navigate = useNavigate()
    const [ openModal, setOpenModal ] = useState(false);
    const [ confirmGoBack, setConfirmGoBack ] = useState(false);
    const [ article, setAricle ] = useState<IArticle>();
    const dispatch = useAppDispatch();

    const {articles, page, size, status} = useAppSelector(selectArticles);

    const onClickEdit = (article: IArticle) => {
        navigate(`/content-editor/${article.internalId}`);
    }

    const articlesActions: IArticlesActions[] = [
        {icon: <PicRightOutlined />, _key: "draft_edit_btn", onClick: onClickEdit}
    ];

    return (
        <Row>
            <DraftArticles {...{actions: articlesActions, hasMore: false, status, articles, getArticles: getArticles({page, size}), getNextArticles: getArticles({page: (page+size), size})}}/>
        </Row>
    );
}

export default CategoryArticles;