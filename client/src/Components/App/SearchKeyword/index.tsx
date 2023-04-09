import React, { ReactNode, useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { getSubtitleById, getKeywordContent, selectSubtitle, setFinalParagraphs, setInitialState } from "../../../features/subtitle/subtitleSlice";
import CustomLoader from "../../CustomLoader";
import ISearchKeyword from "./ISearchKeyword";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, ContentState, convertFromHTML, RawDraftContentBlock } from 'draft-js';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { List, Popover, Row, Typography } from "antd";
import IContent from "../../../interfaces/models/Content";
import CustomButton from "../../CustomButton";
import { CopyOutlined, FileTextOutlined, LinkOutlined, TranslationOutlined } from "@ant-design/icons";
import { Languages } from "../../../interfaces/Enums/Languages";
import { copyContent } from "../../../utils/functions";

const SearchKeyword: React.FC<ISearchKeyword> = ({subtitle}) => {
    const dispatch = useAppDispatch();
    const _subtitle = useAppSelector(selectSubtitle);
    const [editorState, setEditorState] = useState(
        () => EditorState.createEmpty(),
    );
    const [hasSearchedContent, setHasSearchedContent] = useState(false)

    useEffect(() => {
        return () => {
            dispatch(setInitialState());
        }
    }, [])

    useEffect(() => {
        const blocks = convertToRaw(editorState.getCurrentContent()).blocks;
        const finalContents: Array<IContent> = blocks.map((block: RawDraftContentBlock, index): IContent => {
            const id = _subtitle.subtitle.content?.find(cont => cont.content === block.text && cont.selected)?.id
            return ({
                content: block.text,
                orderNumber: (index + 1),
                contentLanguage: Languages.SPANISH,
                selected: true,
                subtitleId: subtitle?.id,
                wordsCount: block.text.split(" ").length,
                id,
                type: 'paragraph',
            })
        }).filter(block => block.content !== "");

        dispatch(setFinalParagraphs(finalContents));
    }, [editorState, subtitle, _subtitle.subtitle.content]);

    useEffect(() => {
        if(subtitle) dispatch(getSubtitleById(subtitle));
    }, [subtitle])

    useEffect(() => {
        setHasSearchedContent(() => {
            if(_subtitle.subtitle.content) {
                if(_subtitle.subtitle.content.filter(text => !text.selected).length > 0){
                    return true
                }else{
                    return false
                }
            }else{
                return false
            }
        });
    }, [_subtitle.subtitle.content]);

    useEffect(() => {
        const selectedContent = _subtitle.subtitle.content ? _subtitle.subtitle.content?.filter(cont => cont.selected).sort((cA, cB) => (cA.orderNumber && cB.orderNumber ? cA.orderNumber < cB.orderNumber ? -1 : 1 : -1)) : [];
        const stringContent: string = `<p>${selectedContent.map(content => content.content).join("</p><p>")}</p>`
        setEditorState(() => 
            EditorState.createWithContent(
                ContentState.createFromBlockArray(
                    convertFromHTML(stringContent).contentBlocks
                )
            )
        )
    }, [_subtitle.subtitle]);

    const searchContent = useCallback(() => {
        console.log(_subtitle.subtitle.content)
        if(_subtitle.subtitle.content && _subtitle.subtitle.content.filter(content => !content.selected).length === 0) dispatch(getKeywordContent(_subtitle.subtitle));
    }, [_subtitle.subtitle]);

    const actionsList = useCallback((item: IContent): Array<ReactNode> => {
        return [
            <p>Words Count: {item.content.split(" ").length}</p>,
            <Popover title="English Text" content={_subtitle.subtitle.enContent?.find(content => content.orderNumber === item.orderNumber)?.content}><TranslationOutlined /></Popover>,
            <Popover content="Copy the parapraph."><CustomButton onClick={() => copyContent(item.content)}><CopyOutlined /></CustomButton></Popover>,
            <Popover content={`Go to reference page. ${item.link}`}><a rel="noreferrer" target="_blank" href={item.link}><LinkOutlined /></a></Popover>,
        ]
    }, [_subtitle.subtitle]);

    if (_subtitle.status === 'loading' || _subtitle.getStatus === 'loading') return <CustomLoader />

    const { Paragraph } = Typography

    return (
        <>
            <Row>
                <h1>{subtitle?.name}</h1>
            </Row>
            <Row style={{minHeight: 300, marginBottom: 100}}>
                <Editor
                    editorState={editorState}
                    defaultEditorState={editorState}
                    onEditorStateChange={setEditorState}
                    wrapperClassName="wrapper-class"
                    editorClassName="editor-class"
                    toolbarClassName="toolbar-class"
                />
            </Row>
            {hasSearchedContent &&
                <Row style={{marginBottom: 10}}>
                    <List
                        itemLayout="vertical"
                        header={<div><FileTextOutlined/> Searched Content</div>}
                        bordered
                        dataSource={_subtitle.subtitle.content?.filter(cont => !cont.selected)}
                        renderItem={(item: IContent) => (
                            <List.Item actions={actionsList(item)}>
                                <Paragraph>
                                    {item.content}
                                </Paragraph>
                            </List.Item>
                        )}
                    />   
                </Row>
            }
            {!hasSearchedContent &&
                <Row style={{marginBottom: 10}}>
                    <CustomButton onClick={() => searchContent()}>Search Content</CustomButton> 
                </Row>
            }
        </>
    )
}

export default SearchKeyword;