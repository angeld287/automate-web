import { Card, Checkbox } from "antd";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../../app/hooks";
import { updateArticleTitle } from "../../../../../features/article/articleSlice";
import { getAllKeywords, selectKeywords, setKeywordAsMain } from "../../../../../features/keywords/keywordSlice";
import IKeyword from "../../../../../interfaces/models/Keyword";
import { removeDuplicate, replaceSpace } from "../../../../../utils/functions";
import Draggable from "../../Draggable";
import Droppable from "../../Droppable";
import { IDragKeyword } from "../../IKeywordsDragAndDrop";
import IArticleStep from "./IArticleStep";

const ArticleStep: React.FC<IArticleStep> = ({article}) => {
    const dispatch = useAppDispatch();
    const _keywords = useAppSelector(selectKeywords);
    const [keywords, setKeywords] = useState<Array<IDragKeyword>>([]);

    useEffect(() => {
        dispatch(getAllKeywords(article.id))
    }, [article]);

    useEffect(() => {
        setKeywords(_keywords.keywords.map(keyword => ({
                parent: keyword.articleId ? keyword.articleId : null,            
                component: (
                    <Draggable id={`${replaceSpace(keyword.name)}-${keyword.id}`} dbId={keyword.id}>{keyword.name}</Draggable>
                ),
                ...keyword
            })))
    }, [_keywords.keywords])

    const setMainKeyword = useCallback((event: CheckboxChangeEvent, keyword: IKeyword) => {
        if(keyword.id) {
            dispatch(setKeywordAsMain({id: keyword.id.toString(), isMain: event.target.checked}));
            if(keyword.articleId) dispatch(updateArticleTitle({id: keyword.articleId, title: event.target.checked ? keyword.name: "Titulo no definido"}));
        }
    }, []);

    return (
        <Droppable key={article.id} id={article.id.toString()}>
            <Card
                style={{margin: 20, minHeight: 250, textAlign: 'start',}} 
                title={article.title}
            >
                {keywords ? removeDuplicate(keywords, 'id').map(keyword => <div style={{marginBottom: 5}} key={keyword.id}>
                    <Checkbox style={{marginRight: 5}} onChange={(e) => {setMainKeyword(e, keyword)}} key={`check-${keyword.id}`} defaultChecked={keyword.isMain}/>
                    {keyword.component}
                </div>
                ) : 'Drop here'}
            </Card>
        </Droppable>
    )
}

export default ArticleStep;