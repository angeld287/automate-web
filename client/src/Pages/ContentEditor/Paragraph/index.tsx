import { Card, Skeleton } from "antd";
import Meta from "antd/es/card/Meta";

import React, { useEffect, useMemo, useState } from "react";
import { useAppDispatch } from "../../../app/hooks";
import { updateSubtitle } from "../../../features/article/articleSlice";
//import { searchKeywordContent } from "../../../features/keyword/keywordAPI";
import { SubTitleContent } from "../../../interfaces/models/Article";
import { IParagraph } from "./IParagraph";

const Paragraph: React.FC<IParagraph> = ({ content, index }) => {
    const [ paragraphContent, setParagraphContent ] = useState<SubTitleContent>();
    const [ loading ] = useState(true);
    const [ contentText, setContentText ] = useState("")
    const dispatch = useAppDispatch();

    useEffect(() => {
        let didCancel = false;
        //let result: any = null;

        //const fetch = async (_subtitle: SubTitleContent) => {
        //    try {
        //        result = await searchKeywordContent(content)    
        //    } catch (error) {
        //        didCancel = true;
        //        setLoading(false)
        //    }
//
        //    if (!didCancel) {
        //        setParagraphContent(result.data.subtitle)
        //        dispatch(updateSubtitle(result.data.subtitle))
        //        setLoading(false)
        //    }
        //}

        //console.log(content.content, paragraphContent)

        if((content.content === undefined || content.content.length === 0) && !paragraphContent){
            //fetch(content);
        }else{
            setParagraphContent(content)
            dispatch(updateSubtitle(content))
        }
            

        return () => {
            didCancel = false;
        }

    }, [content]);

    useEffect(() => {
        if(paragraphContent && paragraphContent.content)
            setContentText(paragraphContent.content.join(". "))
    }, [paragraphContent]);

    const paragraphRequireImage = useMemo(() => (index === 1 || index === 3), [index])

    return (<Card
        style={{ width: '100%', marginTop: 16 }}
    >
        <Skeleton loading={loading} avatar={ paragraphRequireImage ? {shape: "square", size: 100} : false} active>
            <Meta
                style={{textAlign: "left"}}
                //avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                title={paragraphContent?.name}
                description={contentText}
            />
        </Skeleton>
    </Card>)
}

export default Paragraph;