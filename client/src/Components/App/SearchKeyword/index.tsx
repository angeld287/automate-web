import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { getKeywordById, getKeywordContent, selectKeyword } from "../../../features/keyword/keywordSlice";
import CustomLoader from "../../CustomLoader";
import ISearchKeyword from "./ISearchKeyword";
import { Editor, EditorState } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const SearchKeyword: React.FC<ISearchKeyword> = ({subtitle}) => {
    const dispatch = useAppDispatch();
    const keyword = useAppSelector(selectKeyword);
    const [text, setText] = useState<EditorState>()


    useEffect(() => {
        if(subtitle) dispatch(getKeywordById(subtitle));
    }, [subtitle])

    useEffect(() => {
        if(keyword.subtitle.content && keyword.subtitle.content.length === 0) dispatch(getKeywordContent(keyword.subtitle));
    }, [keyword.subtitle]);

    const onEditorStateChange = (e: any) => {
        console.log(e)
    } 

    if (keyword.status === 'loading' || keyword.getStatus === 'loading') return <CustomLoader />

    return (
        <>
            <h1>{subtitle?.name}</h1>

            <Editor
                editorState={text}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                onEditorStateChange={onEditorStateChange}
            />
        </>
    )
}

export default SearchKeyword;