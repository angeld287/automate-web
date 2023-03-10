import { Col, Row } from "antd";
import JobsList from "../../Components/App/JobsList";

const Jobs = () => {
    return (
        <Row className="rows">
            <Col span={22} className="job-list">
                <JobsList/>
            </Col>
        </Row>
    );
}

export default Jobs;