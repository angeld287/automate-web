import { Collapse } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import KeywordsDragAndDrop from "../../Components/App/KeywordsDragAndDrop";
import KeywordsList from "../../Components/App/KeywordsList";
import { getSearchJobDetails, selectKeywordSearchJob } from "../../features/keywordSearchJob/keywordSearchJobSlice";
import IKeyword from "../../interfaces/models/Keyword";

const ArticlesPlanner = () => { 
    let { id } = useParams();
    const [keywords, setKeywords] = useState<Array<IKeyword>>([])

    const dispatch = useAppDispatch();
    const { keywordSearchJob } = useAppSelector(selectKeywordSearchJob);

    useEffect(() => {
        if(id) dispatch(getSearchJobDetails(parseInt(id)));
        return () => {}
    },[]);

    useEffect(() => {
        if(keywordSearchJob && keywordSearchJob.keywords) setKeywords(keywordSearchJob.keywords)
    }, [keywordSearchJob])

    const { Panel } = Collapse;

    return <>
        <h2>Articles Planner {id}</h2>
        <Collapse defaultActiveKey={['1']}>
            <Panel header="Keywords Selections" key="1">
                <KeywordsList items={keywords}/>
            </Panel>
            <Panel header="Articles Planning" key="2">
                <KeywordsDragAndDrop jobId={id} keywords={keywords.filter(keyword => keyword.selected)}/>
            </Panel>
        </Collapse>
    </>;
}

export default ArticlesPlanner;