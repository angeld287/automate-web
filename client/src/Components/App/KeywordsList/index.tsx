import { SearchOutlined } from "@ant-design/icons";
import { Checkbox, Spin } from "antd";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectKeyword, selectKeywordSearchJob } from "../../../features/keywordSearchJob/keywordSearchJobSlice";
import IKeyword from "../../../interfaces/models/Keyword";
import { getGoogleSearchUrl, replaceSpace } from "../../../utils/functions";
import CustomButton from "../../CustomButton";
import CustomTable from "../../CustomTable/CustomTable";
import Draggable from "../KeywordsDragAndDrop/Draggable";
import IKeywordsList, { IKeywordsTable } from "./IKeywordsList"

const KeywordsList: React.FC<IKeywordsList> = ({items, setFavsKeywords}) => {
    const [kewords, setKeywords] = useState<Array<IKeywordsTable>>([])
    const [kwLoading, setKwloading] = useState<number>(0)
    const dispatch = useAppDispatch();
    const {selectStatus} = useAppSelector(selectKeywordSearchJob);

    const onChecked = (item: IKeyword, e: CheckboxChangeEvent) => {
        if(item.id){
            setKwloading(item.id)
            if(e.target.checked){
                dispatch(selectKeyword({id: item.id, selected: true}));
                setFavsKeywords((prev) => [...prev.filter(keyword => keyword.id !== item.id), item])
            }else{
                dispatch(selectKeyword({id: item.id, selected: false}));
                setFavsKeywords((prev) => [...prev.filter(keyword => keyword.id !== item.id)])
            }
        }
    }

    useEffect(() => {
        if(selectStatus === 'idle') setKwloading(0)
    }, [selectStatus]);

    useEffect(() => {
        try {
            if (items !== undefined) {
                setKeywords(items.map((item): IKeywordsTable => ({
                    keyword: <>
                        <Checkbox onChange={(e) => {onChecked(item, e)}} key={item.id} defaultChecked={item.selected}>
                            {item.similarity}
                        </Checkbox>
                        | <a target={"_blank"} href={getGoogleSearchUrl(item.name)}>{item.name}</a>
                        {kwLoading === item.id && <Spin size="small" style={{marginLeft: 10}} />}
                    </>,
                    acciones: [
                        //{ id: `search-action-${item.id}`, color: 'blue', icon: SearchOutlined, onclick: () => { console.log('sss') }, text: "" },
                    ],
                    id: `${replaceSpace(item.name)}-${item.id}`
                })))
            }
        } catch (error) {
            throw new Error('KeywordsList - setKeywords')
        }
    }, [items]);
    
    const _headers = useMemo(() => [
        {name: 'Keyword', sorter: false},
    ], []);
    return <>
        <CustomTable headers={_headers} items={kewords} />
    </>
}

export default KeywordsList