import React, { ReactNode, useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { getKeywordById, getKeywordContent, selectKeyword, setInitialState } from "../../../features/keyword/keywordSlice";
import CustomLoader from "../../CustomLoader";
import ISearchKeyword from "./ISearchKeyword";
import { Editor, EditorState } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { List, Popover, Row, Typography } from "antd";
import IContent from "../../../interfaces/models/Content";
import CustomButton from "../../CustomButton";
import { CopyOutlined, FileTextOutlined, LinkOutlined, TranslationOutlined } from "@ant-design/icons";

const SearchKeyword: React.FC<ISearchKeyword> = ({subtitle}) => {
    const dispatch = useAppDispatch();
    const keyword = useAppSelector(selectKeyword);
    const [text, setText] = useState<EditorState>()

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

    const onEditorStateChange = (e: any) => {
        console.log(e)
    } 

    const copyContent = (content: string) => {
        navigator.clipboard.writeText(content);
    }

    const actionsList = useCallback((item: IContent): Array<ReactNode> => {
        return [
            <p>Words Count: {item.content.split(" ").length}</p>,
            <Popover title="English Text" content={keyword.subtitle.enContent?.find(content => content.orderNumber === item.orderNumber)?.content}><TranslationOutlined /></Popover>,
            <Popover content="Copy the parapraph."><CustomButton onClick={() => copyContent(item.content)}><CopyOutlined /></CustomButton></Popover>,
            <Popover content="Go to reference page."><CustomButton onClick={() => copyContent(item.content)}><LinkOutlined /></CustomButton></Popover>,
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
                    editorState={text}
                    toolbarClassName="toolbarClassName"
                    wrapperClassName="wrapperClassName"
                    editorClassName="editorClassName"
                    onEditorStateChange={onEditorStateChange}
                />
            </Row>
        </>
    )
}

export default SearchKeyword;