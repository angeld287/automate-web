import { PlusCircleOutlined } from "@ant-design/icons";
import { Avatar, Button, Col, List, Row, Skeleton } from "antd";
import { useNavigate } from "react-router-dom";
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
                    <List
                        className="demo-loadmore-list"
                        itemLayout="horizontal"
                        dataSource={list}
                        renderItem={(item) => (
                            <List.Item
                            actions={[<a key="list-loadmore-edit">edit</a>, <a key="list-loadmore-more">more</a>]}
                            >
                            <Skeleton avatar title={false} loading={item.loading} active>
                                <List.Item.Meta
                                avatar={<Avatar src={item.avatar} />}
                                title={<a href="https://ant.design">{item.title}</a>}
                                description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                                />
                                <div>content</div>
                            </Skeleton>
                            </List.Item>
                        )}
                        />
                </Col>
                <Col span={9} className="home-draft-list"><h2>Home</h2></Col>
            </Row>
        </>
    );
}

export default Home;