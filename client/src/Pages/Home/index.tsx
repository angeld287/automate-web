import { PlusCircleOutlined } from "@ant-design/icons";
import { Col, Row } from "antd";
import { useNavigate } from "react-router-dom";
import DraftArticles from "../../Components/App/DraftArticles";
import { IArticle } from "../../interfaces/models/Article";
import "./home.css"

const Home = () => {

    const navigate = useNavigate()

    const onClickEdit = (article: IArticle) => {
        navigate(`/keywords/${article.internalId}`);
    }

      
    return (
        <>
            <Row className="rows">
                <Col span={22} className="home-draft-list">
                    <DraftArticles {...{onClickEdit}}/>
                </Col>
            </Row>
        </>
    );
}

export default Home;