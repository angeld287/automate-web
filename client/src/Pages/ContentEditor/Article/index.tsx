import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Avatar, Col, List, Row, Skeleton } from "antd";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { createWpPost, getArticleByInternalId, selectArticle, setErrorFalse } from "../../../features/article/articleSlice"
import { useParams } from "react-router-dom";
import SearchKeywordsStepper from "../../../Components/App/SearchKeywordsStepper";
import CustomLoader from "../../../Components/CustomLoader";
import CustomButton from "../../../Components/CustomButton";
import { ContainerOutlined, EditOutlined, FileAddOutlined, FileImageOutlined, FileTextOutlined } from "@ant-design/icons";
import AddImage from "../../../Components/App/AddImage";
import './article.css'
import { SubTitleContent } from "../../../interfaces/models/Article";
import Locals from "../../../config/Locals";
import { selectMedia } from "../../../features/media/mediaSlice";
import { updateSubtitle } from "../../../features/article/articleSlice";
import AddIntroAndConclusion from "../../../Components/App/AddIntroAndConclusion";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const ContentEditor = () => {

    const [open, setOpen] = useState(true);
    const [addImageModal, openAddImageModal] = useState(false);
    const [addContentModal, openAddContentModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<SubTitleContent>();
    const [imageType, setImageType ] = useState<'subtitle' | 'article'>('subtitle');
    const [contentType, setContentType ] = useState<'introduction' | 'conclusion'>('introduction');
    const media = useAppSelector(selectMedia);

    let { id } = useParams();
    const article = useAppSelector(selectArticle);
    const dispatch = useAppDispatch();
    
    useEffect(() => {
        if(article.article.id === 0 && id) dispatch(getArticleByInternalId(parseInt(id)))
        return () => {}
    }, []);

    useEffect(() => {
        if(id && !open) dispatch(getArticleByInternalId(parseInt(id)))
    }, [open, id]);

    useEffect(() => {
        let currentSubtitle = article.article.subtitles.find(subtitle => subtitle.id === media.media.subtitleId)
        if(currentSubtitle) {
            currentSubtitle = {...currentSubtitle, image: media.media};
            dispatch(updateSubtitle(currentSubtitle));
            openAddImageModal(false)
        }
    }, [media]);

    useEffect(() => {
        if(article.error !== false) toast(article.error)
    }, [article.error]);

    //useEffect(() => {
    //    console.log(article.status)
    //    setOpen(!(article.article.subtitles.filter(sub => sub.content? sub.content.filter(paragraph => paragraph.selected).length === 0 : true).length === 0))
    //}, [article]);
    
    const onNext = () => {}
    const loading = article.status === 'loading';

    const allSubtitlesCompleted = useMemo(() => article.article.subtitles.filter(subtitle => subtitle.content?.find(cont => cont.selected)).length === article.article.subtitles.length, [article]);
    const IntroAndConclusionCompleted = useMemo(() => article.article.contents?.filter(content => (content.type === 'conclusion' || content.type === 'introduction')).length !== 0 , [article]);

    const publishWpPost = useCallback(() => {
        dispatch(setErrorFalse());
        dispatch(createWpPost(article.article));
    }, [article.article])

    if(loading && article.article.subtitles.length === 0) return <CustomLoader/>

    return <>
        <Row>
            <Col style={{margin: 10}}><CustomButton disabled={article.article.wpId !== null} onClick={() => { setOpen(true)}}>Edit Content<EditOutlined /></CustomButton></Col>
            <Col style={{margin: 10}}><CustomButton disabled={article.article.wpId !== null || !allSubtitlesCompleted} onClick={() => { openAddContentModal(true); setContentType('introduction');}}>Add Introduction<FileTextOutlined /></CustomButton></Col>
            <Col style={{margin: 10}}><CustomButton disabled={article.article.wpId !== null || !allSubtitlesCompleted} onClick={() => { openAddContentModal(true); setContentType('conclusion');}}>Add Conclusion<ContainerOutlined /></CustomButton></Col>
            <Col style={{margin: 10}}><CustomButton loading={article.statusCP === 'loading'} disabled={article.article.wpId !== null && !IntroAndConclusionCompleted} onClick={() => { publishWpPost() }}>Create WP Article<FileAddOutlined /></CustomButton></Col>
        </Row>
        <Row className="">
            <Col>
                <List
                    itemLayout="vertical"
                    size="large"
                    dataSource={article.article.subtitles}
                    renderItem={(item) => {
                        const contentText = item.content?.filter(paragraph => paragraph.selected).map(paragraph => <p style={{textAlign: 'start'}} key={paragraph.id}>{paragraph.content}</p>)
                        const paragraphLoading = item.content?.filter(paragraph => paragraph.selected).length === 0;
                        const image = item.image ? item.image.source_url : Locals.config().DEFAULT_IMAGE;
                        return (
                            <List.Item
                                style={{textAlign: 'right'}}
                                key={item.id}
                                actions={
                                !paragraphLoading
                                    ? [
                                        <CustomButton loading={media.media.subtitleId === item.id && media.status === 'loading'} onClick={(e) => { openAddImageModal(true); setSelectedItem(item); setImageType('subtitle')}}><FileImageOutlined /></CustomButton>,
                                    ]
                                    : undefined
                                }
                                extra={
                                !paragraphLoading && (
                                    <img
                                        width={272}
                                        alt="logo"
                                        src={image}
                                    />
                                )
                                }
                            >
                                <Skeleton loading={paragraphLoading} active avatar className="skeleton-paragraph">
                                    <List.Item.Meta
                                        style={{textAlign: "left"}}
                                        avatar={<Avatar src="https://www.nicepng.com/png/detail/111-1113975_validation-green-check-circle-transparent.png" />}
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
        <SearchKeywordsStepper {...{onNext, open, setOpen}} subtitles={article.article.subtitles}/>
        <AddImage 
            open={addImageModal} 
            setOpen={openAddImageModal} 
            title={selectedItem? selectedItem.name: ""} 
            type={imageType} 
            relatedId={selectedItem ? selectedItem.id: 0}
        />
        <AddIntroAndConclusion
            open={addContentModal} 
            setOpen={openAddContentModal} 
            title={article.article.title}
            articleId={article.article.internalId}
            relatedId={article.article.id}
            type={contentType}
            image={article.article.image?.source_url}
            contents={article.article.contents}
        />
        <ToastContainer/>
    </>;
}

export default ContentEditor;