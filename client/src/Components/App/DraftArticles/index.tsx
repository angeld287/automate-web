import { Divider, List, Row, Skeleton, Space, Tag, Typography } from "antd";
import React, { useEffect } from "react";
import { useAppDispatch } from "../../../app/hooks";
import InfiniteScroll from 'react-infinite-scroll-component';
import IDraftArticles from "./IDraftArticles";
import moment from 'moment'
import CustomButton from "../../CustomButton";
import { generateArticleLink } from "../../../utils/functions";
import { categoryColors } from "../../../utils/constants";
import { ArticleState } from "../../../interfaces/Enums/States";

const DraftArticles: React.FC<IDraftArticles> = ({actions, hasMore, status, articles, getArticles, getNextArticles}) => {

    const dispatch = useAppDispatch();

    useEffect(() => {
        if(articles.length === 0) dispatch(getArticles);
        return () => {}
    },[dispatch, articles.length, getArticles]);

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
                    renderItem={(item) => {
                        const color = categoryColors.find(category => item.category?.trim() === category.name);
                        const TagColorState = (item.sysState?.trim() === ArticleState.AI_CONTENT_RESEARCH) ? "#f50" : 
                                                ((item.sysState?.trim() === ArticleState.CONTENT_RESEARCH) ? "#cd201f" :
                                                    ((item.sysState?.trim() === ArticleState.CREATED_IN_WP) ? "#108ee9" : 
                                                    ( (item.sysState?.trim() === ArticleState.DISCARDED) ? "purple" : "#87d068")))
                        return (
                            <List.Item
                                style={{
                                    borderBottomColor: color ? color.colorCode : '#000',
                                    borderLeftColor: color ? color.colorCode : '#000',
                                    borderBottomWidth: 2,
                                    borderLeftWidth: 2,
                                    marginBottom: 30,
    
                                }}
                                actions={actions?.map(action => <CustomButton onClick={() => action.onClick(item)} key={action._key}>{action.icon}</CustomButton>)}
                            >
                                <Skeleton avatar title={false} loading={false} active>
                                    <List.Item.Meta
                                        //avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                                        title={<div style={{textAlign: 'left'}}>
                                            <Typography.Text>{generateArticleLink(item)}</Typography.Text>
                                        </div>}
                                        description={<div style={{textAlign: 'left'}}>
                                            <Typography.Text italic>{item.title}</Typography.Text><Space><Tag style={{marginLeft: 10}} color={TagColorState}>{item.sysState}</Tag></Space>
                                        </div>}
                                    />
                                    <Typography.Text italic>{moment(item.createdAt).fromNow()}</Typography.Text>
                                </Skeleton>
                            </List.Item>
                        )
                    }}
                />
            </InfiniteScroll>
        </div>
    )
}

export default DraftArticles;