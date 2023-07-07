import { Col, Divider, Row } from "antd";
import { useState } from "react";
import { useAppDispatch } from "../../../app/hooks";
import JobsList from "../../../Components/App/JobsList";
import CustomButton from "../../../Components/CustomButton";
import CustomInputGroup from "../../../Components/CustomInputGroup";
import CustomModal from "../../../Components/CustomModal";
import MultipleCreatableSelect from "../../../Components/MultipleCreatableSelect";
import { startKeywordsSearchJob } from "../../../features/keywordSearchJob/keywordSearchJobSlice";
import { IOption } from "../../../interfaces/models/Utils";

const Jobs = () => {
    const [open, setOpen] = useState(false);
    const [longTailKeyword, setLongTailKeyword] = useState("");
    const [mainKeywords, setMainKeywords] = useState<Array<IOption>>([]);
    const dispatch = useAppDispatch();
    return (
        <>
            <Row>
                <Col style={{margin: 10}}><CustomButton onClick={() => { setOpen(true)}}>Create New Job</CustomButton></Col>
            </Row>
            <Divider orientation="left"></Divider>
            <Row className="rows">
                <Col span={24} className="job-list">
                    <JobsList/>
                </Col>
            </Row>
            <CustomModal {...{open, setOpen}} title="Create new Job" width={800} onOk={() => {
                dispatch(startKeywordsSearchJob({longTailKeyword, mainKeywords: mainKeywords.map(keyword => keyword.label)}));
                setOpen(false)
            }}>
                <CustomInputGroup value={longTailKeyword} defaultValue={longTailKeyword} onChange={(e) => setLongTailKeyword(e.target.value)} label="Long Tail Keyword"></CustomInputGroup>
                <MultipleCreatableSelect value={mainKeywords} setValue={setMainKeywords}/>
            </CustomModal>
        </>
    );
}

export default Jobs;