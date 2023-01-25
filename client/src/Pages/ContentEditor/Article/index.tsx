import React, { useEffect, useState } from "react";
import { Row } from "antd";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { getArticleByInternalId, selectArticle } from "../../../features/article/articleSlice"
import Paragraph from "../Paragraph";
import { useParams } from "react-router-dom";
import SearchKeywordsStepper from "../../../Components/App/SearchKeywordsStepper";

const ContentEditor = () => {

    const [open, setOpen] = useState(true)
    let { id } = useParams();
    const article = useAppSelector(selectArticle);

    useEffect(() => {
        if(article.article.id === 0 && id) dispatch(getArticleByInternalId(parseInt(id)))
        
        return () => {}
    }, []);

    const dispatch = useAppDispatch();
    const onNext = () => {}
    return <>
        <SearchKeywordsStepper {...{onNext, open, setOpen}} subtitles={article.article.subtitles}/>
        <Row className="">
            {article.article.subtitles.map((subtitle, index) => <Paragraph index={index} key={subtitle.id} content={subtitle}/>)}
        </Row>
    </>;
}

export default ContentEditor;