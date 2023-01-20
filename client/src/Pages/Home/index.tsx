import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, Col, Row } from "antd";
import { useNavigate } from "react-router-dom";
import DraftArticles from "../../Components/DraftArticles";
import { IArticle } from "../../interfaces/models/Article";
import "./home.css"

const Home = () => {

    const navigate = useNavigate()

    const list = Array.from({ length: 5 }).map((_, i) => ({
        href: 'https://ant.design',
        title: `ant design part ${i}`,
        loading: false,
        avatar: 'https://joeschmoe.io/api/v1/random',
        description:
          'Ant Design, a design language for background applications, is refined by Ant UED Team.',
        content:
          'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
      }));

    const goToKeyWords = () => {
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
                <Col span={15} className="home-draft-list">
                    <DraftArticles {...{onClickEdit}}/>
                </Col>
                <Col span={9} className="home-draft-list"><h2>Home</h2></Col>
            </Row>
        </>
    );
}

export default Home;