import { LikeOutlined, MessageOutlined, StarOutlined } from "@ant-design/icons";
import { Avatar, Card, Skeleton, Row, List, Space } from "antd";
import { createElement, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { getKeywordsContent, selectArticle } from "../../features/article/articleSlice"

const ContentEditor = () => {
    const [loading, setLoading ] = useState(true);

    const article = useAppSelector(selectArticle);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(getKeywordsContent(article))
    }, []);

    const data = article.subtitiles.map((subtitle) => ({
        href: '',
        title: subtitle.name,
        avatar: 'https://joeschmoe.io/api/v1/random',
        description:
          'Ant Design, a design language for background applications, is refined by Ant UED Team.',
        content: subtitle.content
      }));
      
      const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
        <Space>
          {createElement(icon)}
          {text}
        </Space>
      );

    return <>
        {loading && <Row className="">
            {article.subtitiles.map((subtitle, index) => <Card
                key={subtitle.id}
                style={{ width: '100%', marginTop: 16 }}
            >
                <Skeleton loading={loading} avatar={index === 1 || index === 3} active>
                
                </Skeleton>
            </Card>)}
        </Row>}
        {!loading &&
        <Row style={{textAlign: 'left'}}>
            <List
                itemLayout="vertical"
                size="large"
                dataSource={data}
                renderItem={(item, index) => (
                <List.Item
                    key={item.title}
                    style={{marginTop: 10}}
                    actions={[
                    <IconText icon={StarOutlined} text="156" key="list-vertical-star-o" />,
                    <IconText icon={LikeOutlined} text="156" key="list-vertical-like-o" />,
                    <IconText icon={MessageOutlined} text="2" key="list-vertical-message" />,
                    ]}
                    extra={ (index === 1 || index === 3) ?
                    <img
                        width={272}
                        alt="logo"
                        src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                    />
                    : false}
                >
                    <List.Item.Meta
                    avatar={<Avatar src={item.avatar} />}
                    title={<a href={item.href}>{item.title}</a>}
                    description={item.description}
                    />
                    {item.content}
                </List.Item>
                )}
            />
        </Row>
        }
    </>;
}

export default ContentEditor;