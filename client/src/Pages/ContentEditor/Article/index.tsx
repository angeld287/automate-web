import React from "react";
import { Row } from "antd";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectArticle } from "../../../features/article/articleSlice"
import Paragraph from "../Paragraph";

const ContentEditor = () => {

    const article = useAppSelector(selectArticle);
    const dispatch = useAppDispatch();

    return <>
        <Row className="">
            {article.article.subtitles.map((subtitle, index) => <Paragraph index={index} key={subtitle.id} content={subtitle}/>)}
        </Row>
    </>;
}

export default ContentEditor;