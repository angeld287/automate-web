import { SearchOutlined } from "@ant-design/icons";
import { Checkbox } from "antd";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { useEffect, useMemo, useState } from "react";
import IKeyword from "../../../interfaces/models/Keyword";
import { getGoogleSearchUrl, replaceSpace } from "../../../utils/functions";
import CustomButton from "../../CustomButton";
import CustomTable from "../../CustomTable/CustomTable";
import Draggable from "../KeywordsDragAndDrop/Draggable";
import IKeywordsList, { IKeywordsTable } from "./IKeywordsList"

const KeywordsList: React.FC<IKeywordsList> = ({items, setFavsKeywords}) => {
    const [kewords, setKeywords] = useState<Array<IKeywordsTable>>([])

    const onChecked = (item: IKeyword, e: CheckboxChangeEvent) => {
        if(e.target.checked){
            setFavsKeywords((prev) => [...prev.filter(keyword => keyword.id !== item.id), item])
        }else{
            setFavsKeywords((prev) => [...prev.filter(keyword => keyword.id !== item.id)])
        }
        
    }

    useEffect(() => {
        try {
            if (items !== undefined) {
                setKeywords(items.map((item): IKeywordsTable => ({
                    keyword: <>
                        <Checkbox onChange={(e) => {onChecked(item, e)}} key={item.id}>
                            {item.similarity}
                        </Checkbox>
                        | <a target={"_blank"} href={getGoogleSearchUrl(item.name)}>{item.name}</a>
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