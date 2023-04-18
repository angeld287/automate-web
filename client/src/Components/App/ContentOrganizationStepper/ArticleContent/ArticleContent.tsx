import { CopyOutlined, FileAddOutlined, PlusOutlined, SelectOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { Checkbox, Col, Divider, List, Row, Typography } from "antd";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import IContent from "../../../../interfaces/models/Content";
import { copyContent } from "../../../../utils/functions";
import CustomButton from "../../../CustomButton";
import CustomInput from "../../../CustomInput";
import CustomModal from "../../../CustomModal";
import CustomSelect from "../../../CustomSelect";
import { ISelectOptions } from "../../../CustomSelect/ICustomSelect";
import IArticleContent from "./IArticleContent";
import { Editor } from "react-draft-wysiwyg";
import { ContentState, convertFromHTML, convertToRaw, EditorState, RawDraftContentBlock } from "draft-js";
import { toast } from "react-toastify";
import { Languages } from "../../../../interfaces/Enums/Languages";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { createArticleContent, createSubtitleContent, createSubtitleEn, selectArticle } from "../../../../features/article/articleSlice"
import { SubTitleContent } from "../../../../interfaces/models/Article";

const ArticleContent: React.FC<IArticleContent> = ({article}) => {
    const { Paragraph } = Typography;
    const [ open, setOpen] = useState(false);
    const [ openSubModal, setOpenSubModal] = useState(false);
    const [ type, setType ] = useState<'paragraph' | 'introduction' | 'conclusion' | 'subtitle'>('subtitle');
    const [ subtitle, setSubtitle ] = useState('');
    const [ selectedContent, setSelectedContent ] = useState(['']);
    const [paragraphs, setParagraphs] = useState<Array<IContent>>([])
    const [editorState, setEditorState] = useState(
        () => EditorState.createEmpty(),
    );

    const dispatch = useAppDispatch();
    const { statusSubEn } = useAppSelector(selectArticle);

    useEffect(() => {
        const blocks = convertToRaw(editorState.getCurrentContent()).blocks;
        
        const finalContents: Array<IContent> = blocks.map((block: RawDraftContentBlock, index): IContent => {
            const content: IContent = {
                content: block.text,
                orderNumber: (index + 1),
                contentLanguage: Languages.SPANISH,
                selected: true,
                wordsCount: block.text.split(" ").length,
                type
            };

            if(type === 'subtitle') {
                content.subtitleId = parseInt(subtitle);
                content.type = "paragraph";
            }else{
                content.articleId = article?.internalId;
            }

            return content
        }).filter(block => block.content !== "");
        setParagraphs(finalContents);
    }, [editorState, article?.id, type]);

    const addedSubtitle = useCallback((item: IContent, subtitles?: Array<SubTitleContent>) => {
        return subtitles ? subtitles.find(sub => sub.translatedName === item.content) ? true : false : false
    }, []);

    const addedIntroConclusion = useCallback((type: "introduction" | "conclusion") => {
        return article?.contents?.find(content => content.type?.trim() === type) !== undefined
    }, [article?.contents]);

    const subtitleWithContent = useCallback((item: IContent, subtitles?: Array<SubTitleContent>) => {
        if(subtitles){
            const sub = subtitles.find(sub => sub.translatedName === item.content);
            if(sub && sub.content && sub.content.length){
                return sub.content.length > 0
            }else{
                return false
            }
        }else{
            return false
        }
    }, []);

    const setSelectedParagraph = useCallback((selected: boolean, item: IContent) => {
        if(selected){
            setSelectedContent(prev => {
                return [...prev, item.content]
            }) 
        }else{
            setSelectedContent(prev => {
                return [...prev.filter(content => content !== item.content)]
            })
        }
    }, []);

    const actionsList = useCallback((item: IContent): Array<ReactNode> => {
        return [
            <Col style={{margin: 10}}><Checkbox checked={selectedContent.find(text => item.content === text) !== undefined} onChange={(e) => setSelectedParagraph(e.target.checked, item)}></Checkbox></Col>,
            <p>Words Count: {item.content.split(" ").length}</p>,
            <CustomButton disabled={addedSubtitle(item, article?.subtitles)} onClick={() => copyContent(item.content)}><CopyOutlined /></CustomButton>,
            <CustomButton loading={statusSubEn === "loading"} disabled={addedSubtitle(item, article?.subtitles)} onDoubleClick={() => {setSubtitle(item.content); setOpenSubModal(true)}} onClick={() => addSubtitle(item.content) }><PlusOutlined /></CustomButton>,
            <CustomButton hidden={!addedSubtitle(item, article?.subtitles)} disabled={subtitleWithContent(item, article?.subtitles)} onClick={() => addSubtitleContent(item, article?.subtitles)}><UnorderedListOutlined /></CustomButton>,
            //<TranslationOutlined />,
        ]
    }, [article?.subtitles, selectedContent]);

    const addSubtitleContent = useCallback(async (item: IContent, subtitles?: Array<SubTitleContent>) => {
        const texts = await navigator.clipboard.readText();
        if(article?.contents?.find(content => content.content === texts)){
            toast("You are adding a possible plagiarism")
        }

        if(subtitles){
            const subTitle = subtitles.find(sub => sub.translatedName === item.content)
            if(subTitle){
                const contents = texts.split(/\n/).filter(text => text !== "").map((text, index): IContent => ({
                    content: text,
                    orderNumber: (index + 1),
                    contentLanguage: Languages.SPANISH,
                    selected: true,
                    wordsCount: text.split(" ").length,
                    subtitleId: subTitle.id,
                    type: 'paragraph'
                }) );
                dispatch(createSubtitleContent(contents));
            }
        }
            
    }, [article?.contents]);

    const addIntroConclusion = useCallback(async (type: "introduction" | "conclusion" ) => {
        const texts = await navigator.clipboard.readText();
        if(article?.contents?.find(content => content.content === texts)){
            toast("You are adding a possible plagiarism")
        }

        if(article){
            const contents = texts.split(/\n/).filter(text => text !== "").map((text, index): IContent => ({
                content: text,
                orderNumber: (index + 1),
                contentLanguage: Languages.SPANISH,
                selected: true,
                wordsCount: text.split(" ").length,
                articleId: article.internalId,
                type
            }));
            dispatch(createArticleContent(contents));
        }
            
    }, [article]);

    const addSubtitle = useCallback((text: string) => {
        if(text.length > 99) return toast('This title exceeds the size limit!')
        if(article)
            dispatch(createSubtitleEn({
                articleId: article.internalId,
                name: text,
            }));

        setOpenSubModal(false);
    }, [article])

    const createParagraph = useCallback(() => {
        if(type === 'subtitle') {
            dispatch(createSubtitleContent(paragraphs));
        }else{
            dispatch(createArticleContent(paragraphs));
        }
        setOpen(false);
    }, [paragraphs, type]);

    const copySelectedContent = useCallback(() => {
        navigator.clipboard.writeText(selectedContent.join("\r\n"))
        setSelectedContent([""])
    }, [selectedContent]);

    const typeOptions: ISelectOptions[] = useMemo(() => [
        {id: 'subtitle', name: "Subtitle"},
        {id: 'introduction', name: "Introduction"},
        {id: 'conclusion', name: "Conclusion"},
    ], []);

    const subtitlesOptions: ISelectOptions[] = useMemo(() => article ? article.subtitles.map(subtitle => ({id: subtitle.id.toString(), name: subtitle.name})) : [], [article?.subtitles]);

    return (<>
        <Row>
            <Col style={{margin: 10}}><CustomButton onClick={() => { setOpen(true)}}>Add Content<FileAddOutlined /></CustomButton></Col>
            <Col style={{margin: 10}}><CustomButton disabled={addedIntroConclusion("introduction")} onClick={() => { addIntroConclusion("introduction")}}>Add Introduction</CustomButton></Col>
            <Col style={{margin: 10}}><CustomButton disabled={addedIntroConclusion("conclusion")} onClick={() => { addIntroConclusion("conclusion")}}>Add Conclusion</CustomButton></Col>
            <Col style={{margin: 10}}><CustomButton onClick={() => { copySelectedContent()}}>Copy Contents</CustomButton></Col>
        </Row>
        <Row style={{marginBottom: 10, maxHeight: 600, overflowY: 'scroll'}}>
            <List
                itemLayout="vertical"
                header={<div><SelectOutlined /> Organize Content</div>}
                bordered
                dataSource={article?.contents}
                renderItem={(item: IContent) => (
                    <List.Item actions={actionsList(item)} style={{border: `solid 1px ${addedSubtitle(item, article?.subtitles) ? subtitleWithContent(item, article?.subtitles) ? 'blue' : 'red' : 'white'}`}}>
                        <Paragraph>
                            {item.content}
                        </Paragraph>
                    </List.Item>
                )}
            />   
        </Row>
        <CustomModal {...{open, setOpen}} width="60%" onOk={() => createParagraph()}>
            <Divider />
                <Row>
                    <Col span={4} style={{margin: 10}}><CustomSelect name="text-type" items={typeOptions} onChange={(value) => setType(value)} placeholder="Paragraph Type"></CustomSelect></Col>
                    {type === 'subtitle' && <Col span={12} style={{margin: 10}}><CustomSelect items={subtitlesOptions} onChange={(value) => setSubtitle(value)} name="subtitle" placeholder="Paragraph Subtitle"></CustomSelect></Col>}
                    <Col style={{marginLeft: 10, minHeight: 300, marginBottom: 100}}>
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
            <Divider />
        </CustomModal>
        <CustomModal {...{open: openSubModal, setOpen: setOpenSubModal}} width="60%" onOk={() => addSubtitle(subtitle)}>
            <Divider />
            <Row>
                <Col span={20} style={{margin: 10}}><CustomInput defaultValue={subtitle} value={subtitle} dataTestId="test-id-subtitle" label="Add Subtitle" onChange={(e) => setSubtitle(e.target.value)} placeholder="Paragraph Type"></CustomInput></Col>
            </Row>
        </CustomModal>
    </>)
}

export default ArticleContent;