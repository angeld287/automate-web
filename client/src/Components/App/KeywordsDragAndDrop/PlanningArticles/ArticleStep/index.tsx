import { PlusCircleOutlined } from "@ant-design/icons";
import { Card, Checkbox, Modal } from "antd";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../../../../app/hooks";
import { updateArticleTitle } from "../../../../../features/article/articleSlice";
import { getAllKeywords, selectKeywords, setKeywordAsMain, createForArticle } from "../../../../../features/keywords/keywordSlice";
import IKeyword from "../../../../../interfaces/models/Keyword";
import { removeDuplicate, replaceSpace } from "../../../../../utils/functions";
import CustomInputGroup from "../../../../CustomInputGroup";
import Draggable from "../../Draggable";
import Droppable from "../../Droppable";
import { IDragKeyword } from "../../IKeywordsDragAndDrop";
import IArticleStep from "./IArticleStep";

const ArticleStep: React.FC<IArticleStep> = ({article}) => {
    const dispatch = useAppDispatch();
    const _keywords = useAppSelector(selectKeywords);
    const [keywords, setKeywords] = useState<Array<IDragKeyword>>([]);
    const [addModal, setAddModal] = useState<boolean>(false);
    const [newKeyword, setNewKeyword] = useState<string>('');

    useEffect(() => {
        dispatch(getAllKeywords(article.id))
    }, [article]);

    const addNewKeyword = useCallback(() => {
        if(newKeyword === ""){
            return toast("Pleace add new keyword");
        }
        dispatch(createForArticle({articleId:  article.id, name: newKeyword, orderNumber: _keywords.keywords.length+1}))
        setNewKeyword('');
    }, [newKeyword, article, _keywords.keywords]);

    useEffect(() => {
        setKeywords(_keywords.keywords.map(keyword => ({
                parent: keyword.articleId ? keyword.articleId : null,            
                component: (
                    <Draggable id={`${replaceSpace(keyword.name)}-${keyword.id}`} dbId={keyword.id}>{keyword.name}</Draggable>
                ),
                ...keyword
            })))
    }, [_keywords.keywords]);

    const setMainKeyword = useCallback((event: CheckboxChangeEvent, keyword: IKeyword) => {
        if(keyword.id) {
            dispatch(setKeywordAsMain({id: keyword.id.toString(), isMain: event.target.checked}));
            if(keyword.articleId) dispatch(updateArticleTitle({id: keyword.articleId, title: event.target.checked ? keyword.name: "Titulo no definido"}));
        }
    }, []);

    return (
        <>
            <Droppable key={article.id} id={article.id.toString()}>
                <Card
                    style={{margin: 20, minHeight: 250, textAlign: 'start',}} 
                    title={article.title}
                    actions={[<PlusCircleOutlined onClick={() => {setAddModal(true)}} key="addKeyword"/>]}
                >
                    <div style={{minHeight: 150}}>
                        {keywords ? removeDuplicate(keywords, 'id').map(keyword => <div style={{marginBottom: 5}} key={keyword.id}>
                            <Checkbox style={{marginRight: 5}} onChange={(e) => {setMainKeyword(e, keyword)}} key={`check-${keyword.id}`} defaultChecked={keyword.isMain}/>
                            {keyword.component}
                        </div>
                        ) : 'Drop here'}
                    </div>
                </Card>
            </Droppable>
            <Modal
                title="New Keyword"
                open={addModal}
                onOk={() => addNewKeyword()}
                confirmLoading={_keywords.createStatus === 'loading'}
                onCancel={() => setAddModal(false)}
            >
                <CustomInputGroup label="" placeholder="Type a new keyword" onChange={(e) => setNewKeyword(e.target.value)}/>
            </Modal>
        </>
    )
}

export default ArticleStep;