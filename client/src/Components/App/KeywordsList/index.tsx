import { SearchOutlined } from "@ant-design/icons";
import { useEffect, useMemo, useState } from "react";
import IKeyword from "../../../interfaces/models/Keyword";
import { getGoogleSearchUrl, replaceSpace } from "../../../utils/functions";
import CustomTable from "../../CustomTable/CustomTable";
import IKeywordsList, { IKeywordsTable } from "./IKeywordsList"

const KeywordsList: React.FC<IKeywordsList> = ({items}) => {
    const [kewords, setKeywords] = useState<Array<IKeywordsTable>>([])

    useEffect(() => {
        try {
            if (items !== undefined) {
                setKeywords(items.map((item): IKeywordsTable => ({
                    keyword: <>{item.similarity} | <a target={"_blank"} href={getGoogleSearchUrl(item.name)}>{item.name}</a></>,
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