import { CloseCircleOutlined } from "@ant-design/icons";
import { Col, Input, Row, Tag } from "antd";
import { Editor } from "react-draft-wysiwyg";
import { ContentState, convertFromHTML, convertToRaw, EditorState, RawDraftContentBlock } from "draft-js";
import React, { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { createMedia, selectMedia } from "../../../features/media/mediaSlice";
import { Languages } from "../../../interfaces/Enums/Languages";
import IContent from "../../../interfaces/models/Content";
import { isValidImageUrl, isValidUrl } from "../../../utils/functions";
import CustomModal from "../../CustomModal";
import IAddIntroAndConclusion from "./IAddIntroAndConclusion";
import Locals from "../../../config/Locals";
import { createArticleIntroAndConclusion } from "../../../features/article/articleSlice";

const AddIntroAndConclusion: React.FC<IAddIntroAndConclusion> = ({open, setOpen, type, title, articleId, relatedId, image, contents}) => {
    //const [url, setUrl] = useState('');
    const [error, setError] = useState<undefined | string>(undefined);
    const [paragraph, setParagraph] = useState<Array<IContent>>([])
    const [editorState, setEditorState] = useState(
        () => EditorState.createEmpty(),
    );

    const dispatch = useAppDispatch();
    const media = useAppSelector(selectMedia);

    useEffect(() => {
        const blocks = convertToRaw(editorState.getCurrentContent()).blocks;
        
        const finalContents: Array<IContent> = blocks.map((block: RawDraftContentBlock, index): IContent => {
            const id = contents?.find(cont => cont.content === block.text && cont.selected)?.id
            return ({
                content: block.text,
                orderNumber: (index + 1),
                contentLanguage: Languages.SPANISH,
                selected: true,
                articleId,
                wordsCount: block.text.split(" ").length,
                type, 
                id,
            })
        }).filter(block => block.content !== "");

        setParagraph(finalContents);
    }, [editorState, articleId, type, contents]);

    useEffect(() => {
        populateContent()
    }, [type]);

    const populateContent = useCallback(() => {
        const selectedContent = contents ? contents.filter(cont => cont.type && cont.type.trim() === type).sort((cA, cB) => (cA.orderNumber && cB.orderNumber ? cA.orderNumber < cB.orderNumber ? -1 : 1 : -1)) : [];
        const stringContent: string = `<p>${selectedContent.map(content => content.content).join("</p><p>")}</p>`
        setEditorState(() => 
            EditorState.createWithContent(
                ContentState.createFromBlockArray(
                    convertFromHTML(stringContent).contentBlocks
                )
            )
        )
    }, [contents, type]);

    const searchImage = useCallback((url: string) => {
        if(url === ''){
            return setError('Please provide an image url.')
        }

        if(url !== '' && (!isValidUrl(url) || !isValidImageUrl(url))) {
            return setError('The url is not valid image url.')
        }

        setError(undefined)
        dispatch(createMedia({imageAddress: url, title: title ? title : "", type: 'article', relatedId}))
    } , [title, relatedId])

    const addContent = useCallback(() => {
        if(paragraph.length === 0){
            return setError('Please add a paragraph.')
        }
        dispatch(createArticleIntroAndConclusion(paragraph))
        setOpen(false);
    },[paragraph])
    
    return (
        <CustomModal title={`Complete the article ${type} for Article: ${title}`} {...{open, setOpen}} onOk={addContent} width="90%" >
            <Row>
                {(type === 'introduction') && <Col sm={9}>
                    <Row>
                        <img
                            width="100%"
                            src={image ? image : Locals.config().DEFAULT_IMAGE}
                        />
                    </Row>
                    <Row style={{marginTop: 10}}>
                        <Input.Search
                            placeholder="Image Url"
                            allowClear
                            enterButton="Search"
                            size="large"
                            loading={media.status === 'loading'}
                            onChange={() => {setError(undefined)}}
                            onSearch={searchImage}
                        />
                    </Row>
                </Col>}
                <Col style={{marginLeft: 10, minHeight: 300, marginBottom: 100}} sm={type === 'introduction' ? 14 : undefined}>
                    <Editor
                        editorState={editorState}
                        defaultEditorState={editorState}
                        onEditorStateChange={setEditorState}
                        wrapperClassName="wrapper-class"
                        editorClassName="editor-class"
                        toolbarClassName="toolbar-class"
                    />
                </Col>
            </Row>
            <Row style={{marginTop: 10}}>
                {(error !== undefined) && <Col><Tag icon={<CloseCircleOutlined />} color="error">{error}</Tag></Col>}
            </Row>
        </CustomModal>
    )
}

export default React.memo(AddIntroAndConclusion);