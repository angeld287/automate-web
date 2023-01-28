import React, { ReactNode, useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { getKeywordById, getKeywordContent, selectKeyword, setInitialState } from "../../../features/keyword/keywordSlice";
import CustomLoader from "../../CustomLoader";
import ISearchKeyword from "./ISearchKeyword";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from 'draft-js';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { List, Popover, Row, Typography } from "antd";
import IContent from "../../../interfaces/models/Content";
import CustomButton from "../../CustomButton";
import { CopyOutlined, FileTextOutlined, LinkOutlined, TranslationOutlined } from "@ant-design/icons";

const SearchKeyword: React.FC<ISearchKeyword> = ({subtitle}) => {
    const dispatch = useAppDispatch();
    const keyword = useAppSelector(selectKeyword);
    const [editorState, setEditorState] = useState(
        () => EditorState.createEmpty(),
      );
    
    //useEffect(() => {
    //    console.log(editorState.getCurrentContent().getPlainText('\u0001'))
    //    console.log(convertToRaw(editorState.getCurrentContent()).blocks)
    //}, [editorState]);

    useEffect(() => {
        return () => {
            dispatch(setInitialState());
        }
    }, [])

    useEffect(() => {
        if(subtitle) dispatch(getKeywordById(subtitle));
    }, [subtitle])

    useEffect(() => {
        if(keyword.subtitle.content && keyword.subtitle.content.length === 0) dispatch(getKeywordContent(keyword.subtitle));
    }, [keyword.subtitle]);

    const copyContent = (content: string) => {
        navigator.clipboard.writeText(content);
    }

    const actionsList = useCallback((item: IContent): Array<ReactNode> => {
        return [
            <p>Words Count: {item.content.split(" ").length}</p>,
            <Popover title="English Text" content={keyword.subtitle.enContent?.find(content => content.orderNumber === item.orderNumber)?.content}><TranslationOutlined /></Popover>,
            <Popover content="Copy the parapraph."><CustomButton onClick={() => copyContent(item.content)}><CopyOutlined /></CustomButton></Popover>,
            <Popover content={`Go to reference page. ${item.link}`}><a target="_blank" href={item.link}><LinkOutlined /></a></Popover>,
        ]
    }, [keyword.subtitle]);

    if (keyword.status === 'loading' || keyword.getStatus === 'loading') return <CustomLoader />

    const { Paragraph } = Typography

    return (
        <>
            <Row>
                <h1>{subtitle?.name}</h1>
            </Row>
            <Row style={{marginBottom: 10}}>
                <List
                    itemLayout="vertical"
                    header={<div><FileTextOutlined/> Searched Content</div>}
                    bordered
                    dataSource={keyword.subtitle.content}
                    renderItem={(item: IContent) => (
                        <List.Item actions={actionsList(item)}>
                            <Paragraph>
                                {item.content}
                            </Paragraph>
                        </List.Item>
                    )}
                />
            </Row>
            <Row>
                <Editor
                    editorState={editorState}
                    onEditorStateChange={setEditorState}
                />
            </Row>
        </>
    )
}

export default SearchKeyword;