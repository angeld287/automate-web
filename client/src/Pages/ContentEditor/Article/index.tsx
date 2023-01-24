import React, { useEffect } from "react";
import { Row } from "antd";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { getArticleByInternalId, selectArticle } from "../../../features/article/articleSlice"
import Paragraph from "../Paragraph";
import { useParams } from "react-router-dom";

const ContentEditor = () => {

    let { id } = useParams();
    const article = useAppSelector(selectArticle);

    useEffect(() => {
        if(article.article.id === 0 && id) dispatch(getArticleByInternalId(parseInt(id)))
        
        return () => {}
    }, []);

    const dispatch = useAppDispatch();

    return <>
        <Row className="">
            {article.article.subtitles.map((subtitle, index) => <Paragraph index={index} key={subtitle.id} content={subtitle}/>)}
        </Row>
    </>;
}

export default ContentEditor;