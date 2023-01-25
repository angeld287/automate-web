import React, { useEffect, useState } from "react";
import { searchKeywordContent } from "../../../features/keyword/keywordAPI";
import { SubTitleContent } from "../../../interfaces/models/Article";
import ISearchKeyword from "./ISearchKeyword";

const SearchKeyword: React.FC<ISearchKeyword> = ({subtitle}) => {
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        let didCancel = false;
        let result: any = null;

        const fetch = async (_subtitle: SubTitleContent) => {
            try {
                result = await searchKeywordContent(_subtitle)
            } catch (error) {
                didCancel = true;
                setLoading(false)
            }

            if (!didCancel) {
                setLoading(false)
            }
        }

        //fetch(subtitle);

        return () => {
            didCancel = false;
        }

    }, []);

    return (
        <h1>{subtitle?.name}</h1>
    )
}

export default SearchKeyword;