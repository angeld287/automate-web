import React, { useEffect, useState } from "react";
import { Row } from "antd";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { getArticleByInternalId, selectArticle } from "../../../features/article/articleSlice"
import Paragraph from "../Paragraph";
import { useParams } from "react-router-dom";
import CustomModal from "../../../Components/CustomModal";
import SearchKeywordStepper from "../../../Components/SearchKeywordStepper";

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
        <CustomModal {...{open, setOpen}} width="80%">
            <SearchKeywordStepper {...{onNext}} subtitles={article.article.subtitles}/>
        </CustomModal>
        <Row className="">
            {article.article.subtitles.map((subtitle, index) => <Paragraph index={index} key={subtitle.id} content={subtitle}/>)}
        </Row>
    </>;
}

export default ContentEditor;