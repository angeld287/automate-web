import { FileTextOutlined } from "@ant-design/icons";
import { Checkbox, Spin } from "antd";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { ColumnFilterItem } from "antd/es/table/interface";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { openAICreateArticle, selectKeyword, selectKeywordSearchJob, setKeywordCategory } from "../../../features/keywordSearchJob/keywordSearchJobSlice";
import IKeyword from "../../../interfaces/models/Keyword";
import { getGoogleSearchUrl, replaceSpace } from "../../../utils/functions";
import CustomTable from "../../CustomTable/CustomTable";
import { ITableHeader } from "../../CustomTable/ICustomTable";
import { removeDuplicate } from '../../../utils/functions';
import IKeywordsList, { IKeywordsTable } from "./IKeywordsList"
import { getCategoryList, selectWputils } from "../../../features/WPUtils/wputilsSlice";
import { ISelectOptions } from "../../CustomSelect/ICustomSelect";

const KeywordsList: React.FC<IKeywordsList> = ({items}) => {
    const [keywords, setKeywords] = useState<Array<IKeywordsTable>>([])
    const [kwLoading, setKwloading] = useState<number>(0)
    const dispatch = useAppDispatch();
    const {selectStatus, AICreateStatus} = useAppSelector(selectKeywordSearchJob);
    const { categories, statusc } = useAppSelector(selectWputils);

    useEffect(() => {
        dispatch(getCategoryList())
    },[])

    const onChecked = (item: IKeyword, e: CheckboxChangeEvent) => {
        if(item.id){
            setKwloading(item.id)
            if(e.target.checked){
                dispatch(selectKeyword({id: item.id, selected: true}));
            }else{
                dispatch(selectKeyword({id: item.id, selected: false}));
            }
        }
    }

    const updateCategory = useCallback((value: string, keyword: IKeyword) => {
        if(keyword.id)
            dispatch(setKeywordCategory({id: keyword.id.toString(), category: value}))
    }, []);

    const createArticle = useCallback((item: IKeyword) => {
        if(item.id && item.keywordSearchJobId && item.category){
            setKwloading(item.id)
            dispatch(openAICreateArticle({text: item.name, keywordId: item.id, jobId: item.keywordSearchJobId, category: item.category}))
        }
    }, [])

    const categoryList: Array<ISelectOptions> = useMemo(() => {
        if(statusc === "loading") return []
        return categories.map(category => ({id: category.slug, name: category.name }))
    }, [categories, statusc]);

    useEffect(() => {
        if(selectStatus === 'idle') setKwloading(0)
    }, [selectStatus]);

    useEffect(() => {
        if(AICreateStatus === 'idle') setKwloading(0)
    }, [AICreateStatus]);

    useEffect(() => {
        try {
            if (items !== undefined) {
                setKeywords(items.map((item): IKeywordsTable => ({
                    selected: <>
                        <Checkbox onChange={(e) => {onChecked(item, e)}} key={item.id} defaultChecked={item.selected}></Checkbox>
                        {kwLoading === item.id && <Spin size="small" style={{marginLeft: 10}} />}
                    </>,
                    similarity: item.similarity,
                    keyword: <a target={"_blank"} href={getGoogleSearchUrl(item.name)}>{item.name}</a>,
                    actions: item.selected ? [
                        { type: "select", component: { _key: `category-select-${item.id}`, name: `category-select-${item.id}`, items: categoryList, disabled: item.articleId !== null, onChange: (value: string) => updateCategory(value, item), defaultValue: item.category} },
                        { type: "button", component: { _key: `create-article-ai-${item.id}`,id: `create-article-ai-${item.id}`, color: 'blue', icon: <FileTextOutlined />, onClick: () => createArticle(item), text: "", disabled: item.articleId !== null, loading: (kwLoading === item.id && AICreateStatus === 'loading') } },
                    ] : [],
                    id: `${replaceSpace(item.name)}-${item.id}`,
                    dataName: item.name
                })))
            }
        } catch (error) {
            throw new Error('KeywordsList - setKeywords')
        }
    }, [items, categoryList]);
    
    const _headers = useMemo((): Array<ITableHeader> => {
        
        const filterList: Array<ColumnFilterItem> = [];

        items.forEach(item => {
            item.name.split(" ").forEach(word => {
                if(word !== '' && word.length > 3) filterList.push({text: word, value: word.toLowerCase()})
            });
        });

        return [
            {
                name: 'Selected', 
                sorter: false, 
                width: 100
            },
            {
                name: 'Similarity', 
                sorter: false, 
                width: 100
            },
            {
                filterMode: "tree",
                name: 'Keyword', 
                sorter: false, 
                filterSearch: true,
                filters: removeDuplicate(filterList, 'value'),
                onFilter: (value: string | number | boolean, record: IKeywordsTable) => record.dataName.includes(value.toString()),
                width: 600
            },
            {
                name: 'Actions', 
                sorter: false, 
                width: 300
            },
        ]
    }, [items]);
    return <>
        <CustomTable headers={_headers} items={keywords} />
    </>
}

export default KeywordsList