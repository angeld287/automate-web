import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { getKeywordById, getKeywordContent, selectKeyword, setInitialState } from "../../../features/keyword/keywordSlice";
import CustomLoader from "../../CustomLoader";
import ISearchKeyword from "./ISearchKeyword";
import { Editor, EditorState } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { List, Row, Typography } from "antd";
import IContent from "../../../interfaces/models/Content";
import CustomButton from "../../CustomButton";
import { CopyOutlined } from "@ant-design/icons";

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
        console.log(keyword.subtitle)
        if(keyword.subtitle.content && keyword.subtitle.content.length === 0) dispatch(getKeywordContent(keyword.subtitle));
    }, [keyword.subtitle]);

    const onEditorStateChange = (e: any) => {
        console.log(e)
    } 

    const copyContent = (content: string) => {
        navigator.clipboard.writeText(content);
    }

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
                    header={<div>Searched Content</div>}
                    bordered
                    dataSource={keyword.subtitle.content}
                    renderItem={(item: IContent) => (
                        <List.Item actions={[<p>Words Count: {item.content.split(" ").length}</p>, <CustomButton onClick={() => copyContent(item.content)}><CopyOutlined /></CustomButton>]}>
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