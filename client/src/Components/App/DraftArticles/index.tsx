import { Avatar, Divider, List, Row, Skeleton, Typography } from "antd";
import React, { useEffect } from "react";
import { useAppDispatch } from "../../../app/hooks";
import InfiniteScroll from 'react-infinite-scroll-component';
import IDraftArticles from "./IDraftArticles";
import moment from 'moment'
import CustomButton from "../../CustomButton";

const DraftArticles: React.FC<IDraftArticles> = ({actions, hasMore, status, articles, getArticles, getNextArticles}) => {

    const dispatch = useAppDispatch();

    useEffect(() => {
        if(articles.length === 0) dispatch(getArticles);
        return () => {}
    },[]);

    return (
        <div>
            <Row style={{margin:15}}>
                <h3>Articles Quantity: {articles.length}</h3>
            </Row>
            <InfiniteScroll
                dataLength={articles.length}
                next={() => dispatch(getNextArticles)}
                hasMore={hasMore}
                loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
                endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
                scrollableTarget="scrollableDiv"
            >

                <List
                    loading={status === 'loading'}
                    className="draft-articles-list"
                    itemLayout="horizontal"
                    dataSource={articles}
                    renderItem={(item) => (
                        <List.Item
                            actions={actions?.map(action => <CustomButton onClick={() => action.onClick(item)} key={action._key}>{action.icon}</CustomButton>)}
                        >
                            <Skeleton avatar title={false} loading={false} active>
                                <List.Item.Meta
                                avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                                title={<a href="https://ant.design">{item.title}</a>}
                                //description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                                />
                                <Typography.Text italic>{moment(item.createdAt).fromNow()}</Typography.Text>
                            </Skeleton>
                        </List.Item>
                    )}
                />
            </InfiniteScroll>
        </div>
    )
}

export default DraftArticles;