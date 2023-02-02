import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, Col, Row } from "antd";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import DraftArticles from "../../Components/App/DraftArticles";
import { setArticleInititalState } from "../../features/article/articleSlice";
import { IArticle } from "../../interfaces/models/Article";
import "./home.css"

const Home = () => {

    const navigate = useNavigate()
    const dispatch = useAppDispatch();

    const goToKeyWords = () => {
        dispatch(setArticleInititalState())
        navigate('/keywords');
    }

    const onClickEdit = (article: IArticle) => {
        navigate(`/keywords/${article.internalId}`);
    }

      
    return (
        <>
            <Row className="rows">
                <Button
                    type="primary"
                    icon={<PlusCircleOutlined />}
                    onClick={() => {goToKeyWords()}}
                >
                    Create new article
                </Button>
            </Row>
            <Row className="rows">
                <Col span={22} className="home-draft-list">
                    <DraftArticles {...{onClickEdit}}/>
                </Col>
            </Row>
        </>
    );
}

export default Home;