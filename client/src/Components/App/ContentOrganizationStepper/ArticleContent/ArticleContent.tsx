import { CopyOutlined, FileAddOutlined, PlusOutlined, SelectOutlined } from "@ant-design/icons";
import { Col, Divider, List, Row, Typography } from "antd";
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

const ArticleContent: React.FC<IArticleContent> = ({article}) => {
    const { Paragraph } = Typography;
    const [ open, setOpen] = useState(false);
    const [ openSubModal, setOpenSubModal] = useState(false);
    const [ type, setType ] = useState<'paragraph' | 'introduction' | 'conclusion' | 'subtitle'>('subtitle');
    const [ subtitle, setSubtitle ] = useState('');
    const [paragraphs, setParagraphs] = useState<Array<IContent>>([])
    const [editorState, setEditorState] = useState(
        () => EditorState.createEmpty(),
    );

    useEffect(() => {
        const blocks = convertToRaw(editorState.getCurrentContent()).blocks;
        
        const finalContents: Array<IContent> = blocks.map((block: RawDraftContentBlock, index): IContent => {
            return ({
                content: block.text,
                orderNumber: (index + 1),
                contentLanguage: Languages.SPANISH,
                selected: true,
                articleId: article?.id,
                wordsCount: block.text.split(" ").length,
                type,
            })
        }).filter(block => block.content !== "");

        setParagraphs(finalContents);
    }, [editorState, article?.id, type]);

    const actionsList = useCallback((item: IContent): Array<ReactNode> => {
        return [
            <p>Words Count: {item.content.split(" ").length}</p>,
            <CustomButton onClick={() => copyContent(item.content)}><CopyOutlined /></CustomButton>,
            <CustomButton onDoubleClick={() => {setSubtitle(item.content); setOpenSubModal(true)}} onClick={() => addSubtitles(item.content) }><PlusOutlined /></CustomButton>,
            //<TranslationOutlined />,
        ]
    }, []);

    const addSubtitles = useCallback((text: string) => {
        if(text.length > 99) return toast('This title exceeds the size limit!')

        setOpenSubModal(false);
    }, [])

    const typeOptions: ISelectOptions[] = useMemo(() => [
        {id: 'subtitle', name: "Subtitle"},
        {id: 'introduction', name: "Introduction"},
        {id: 'conclusion', name: "Conclusion"},
    ], []);

    const subtitlesOptions: ISelectOptions[] = useMemo(() => article ? article.subtitles.map(subtitle => ({id: subtitle.id.toString(), name: subtitle.name})) : [], [article?.subtitles]);

    return (<>
        <Row>
            <Col style={{margin: 10}}><CustomButton onClick={() => { setOpen(true)}}>Add Content<FileAddOutlined /></CustomButton></Col>
        </Row>
        <Row style={{marginBottom: 10, maxHeight: 600, overflowY: 'scroll'}}>
            <List
                itemLayout="vertical"
                header={<div><SelectOutlined /> Organize Content</div>}
                bordered
                dataSource={article?.contents}
                renderItem={(item: IContent) => (
                    <List.Item actions={actionsList(item)}>
                        <Paragraph>
                            {item.content}
                        </Paragraph>
                    </List.Item>
                )}
            />   
        </Row>
        <CustomModal {...{open, setOpen}} width="60%">
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
        <CustomModal {...{open: openSubModal, setOpen: setOpenSubModal}} width="60%" onOk={() => addSubtitles(subtitle)}>
            <Divider />
            <Row>
                <Col span={20} style={{margin: 10}}><CustomInput defaultValue={subtitle} value={subtitle} dataTestId="test-id-subtitle" label="Add Subtitle" onChange={(e) => setSubtitle(e.target.value)} placeholder="Paragraph Type"></CustomInput></Col>
            </Row>
        </CustomModal>
    </>)
}

export default ArticleContent;