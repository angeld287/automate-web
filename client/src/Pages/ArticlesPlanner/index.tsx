import { PlusOutlined } from "@ant-design/icons";
import { Collapse, Row } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import KeywordsDragAndDrop from "../../Components/App/KeywordsDragAndDrop";
import KeywordsList from "../../Components/App/KeywordsList";
import CustomButton from "../../Components/CustomButton";
import CustomInputGroup from "../../Components/CustomInputGroup";
import CustomModal from "../../Components/CustomModal";
import { createKeywordManually, getSearchJobDetails, selectKeywordSearchJob } from "../../features/keywordSearchJob/keywordSearchJobSlice";
import IKeyword from "../../interfaces/models/Keyword";

const ArticlesPlanner = () => { 
    let { id } = useParams();
    const [keywords, setKeywords] = useState<Array<IKeyword>>([])
    const [ newKeyModal, setNewKeyModal ] = useState(false)
    const [ keyword, setKeyword ] = useState("")

    const dispatch = useAppDispatch();
    const { keywordSearchJob } = useAppSelector(selectKeywordSearchJob);

    useEffect(() => {
        if(id) dispatch(getSearchJobDetails(parseInt(id)));
        return () => {}
    },[]);

    useEffect(() => {
        if(keywordSearchJob && keywordSearchJob.keywords) setKeywords(keywordSearchJob.keywords)
    }, [keywordSearchJob]);

    const createKeyword = useCallback(() => {
        if(keywordSearchJob.id)
            dispatch(createKeywordManually({name: keyword, jobId: keywordSearchJob.id.toString()}));
            setNewKeyModal(false);
    }, [keyword, keywordSearchJob])

    const { Panel } = Collapse;

    return <>
        <h2>Articles Planner {id}</h2>
        <Collapse defaultActiveKey={['1']}>
            <Panel header="Keywords Selections" key="1">
                <KeywordsList items={keywords.filter(keyword => keyword.createdManually !== true)}/>
            </Panel>
            <Panel header="Keywords Created Manually" key="2">
                <Row>
                    <CustomButton onClick={() => setNewKeyModal(true)}><PlusOutlined /></CustomButton>
                </Row>
                <KeywordsList items={keywords.filter(keyword => keyword.createdManually === true)}/>
            </Panel>
            <Panel header="Articles Planning" key="3">
                <KeywordsDragAndDrop jobId={id} keywords={keywords.filter(keyword => keyword.selected)}/>
            </Panel>
        </Collapse>
        <CustomModal open={newKeyModal} title="Create New Keyword" setOpen={setNewKeyModal} onOk={() => createKeyword()}>
            <CustomInputGroup label="Keyword" onChange={(e) => setKeyword(e.target.value)} value={keyword}/>
        </CustomModal>
    </>;
}

export default ArticlesPlanner;