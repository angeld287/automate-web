import { Col, Row } from "antd";
import { useParams } from "react-router-dom";
import KeywordsDragAndDrop from "../../Components/App/KeywordsDragAndDrop";

const ArticlesPlanner = () => {
    let { id } = useParams();

    return <>
        <h2>ArticlesPlanner {id}</h2>
        <Row className="">
            <Col span={22} className="drag-and-drop">
                <KeywordsDragAndDrop/>
            </Col>
        </Row>
    </>;
}

export default ArticlesPlanner;