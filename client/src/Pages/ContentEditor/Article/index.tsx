import React, { useEffect, useState } from "react";
import { Avatar, Col, List, Row, Skeleton } from "antd";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { getArticleByInternalId, selectArticle } from "../../../features/article/articleSlice"
import Paragraph from "../Paragraph";
import { useParams } from "react-router-dom";
import SearchKeywordsStepper from "../../../Components/App/SearchKeywordsStepper";
import CustomLoader from "../../../Components/CustomLoader";
import CustomButton from "../../../Components/CustomButton";
import { EditOutlined, FileImageOutlined } from "@ant-design/icons";

const ContentEditor = () => {

    const [open, setOpen] = useState(true)
    const [addImageModal, openAddImageModal] = useState(true)
    let { id } = useParams();
    const article = useAppSelector(selectArticle);

    useEffect(() => {
        if(article.article.id === 0 && id) dispatch(getArticleByInternalId(parseInt(id)))
        return () => {}
    }, []);

    useEffect(() => {
        if(id && !open) dispatch(getArticleByInternalId(parseInt(id)))
    }, [open, id]);

    //useEffect(() => {
    //    console.log(article.status)
    //    setOpen(!(article.article.subtitles.filter(sub => sub.content? sub.content.filter(paragraph => paragraph.selected).length === 0 : true).length === 0))
    //}, [article]);

    const dispatch = useAppDispatch();
    const onNext = () => {}
    const loading = article.status === 'loading';

    if(loading && article.article.subtitles.length === 0) return <CustomLoader/>

    return <>
        <Row>
            <Col style={{margin: 10}}><CustomButton onClick={() => { setOpen(true)}}>Edit Content<EditOutlined /></CustomButton></Col>
        </Row>
        <SearchKeywordsStepper {...{onNext, open, setOpen}} subtitles={article.article.subtitles}/>
        <Row className="">
            <Col>
                <List
                    itemLayout="vertical"
                    size="large"
                    dataSource={article.article.subtitles}
                    renderItem={(item) => {
                        const contentText = item.content?.filter(paragraph => paragraph.selected).map(paragraph => <p style={{textAlign: 'start'}} key={paragraph.id}>{paragraph.content}</p>)
                        return (
                            <List.Item
                                style={{textAlign: 'right'}}
                                key={item.name}
                                actions={
                                !loading
                                    ? [
                                        <CustomButton onClick={() => { openAddImageModal(true)}}><FileImageOutlined /></CustomButton>,
                                    ]
                                    : undefined
                                }
                                extra={
                                !loading && (
                                    <img
                                    width={272}
                                    alt="logo"
                                    src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                                    />
                                )
                                }
                            >
                                <Skeleton loading={loading} active avatar>
                                    <List.Item.Meta
                                        style={{textAlign: "left"}}
                                        avatar={<Avatar src="https://cdn.shopify.com/s/files/1/2216/9173/files/Aceite_de_coco_sqre.jpg" />}
                                        title={item.name}
                                        description={`words count: ${item.content?.reduce((a, b) => a + (b.wordsCount ? b.wordsCount : 0), 0)}`}
                                    />
                                    {contentText}
                                </Skeleton>
                            </List.Item>
                            )
                    }}
                />
            </Col>
        </Row>
    </>;
}

export default ContentEditor;