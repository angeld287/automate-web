import { Avatar, Divider, List, Skeleton, Typography } from "antd";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { getArticles, selectArticles } from "../../../features/articles/articlesSlice";
import InfiniteScroll from 'react-infinite-scroll-component';
import IDraftArticles from "./IDraftArticles";
import moment from 'moment'
import CustomButton from "../../CustomButton";
import { EditOutlined } from "@ant-design/icons";

const DraftArticles: React.FC<IDraftArticles> = ({onClickEdit}) => {

    const dispatch = useAppDispatch();
    const {articles, page, size, status, hasMore} = useAppSelector(selectArticles);

    useEffect(() => {
        if(articles.length === 0) dispatch(getArticles({page, size}));
        return () => {}
    },[]);

    return (
        <InfiniteScroll
            dataLength={articles.length}
            next={() => dispatch(getArticles({page: (page+size), size}))}
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
                    actions={[<CustomButton onClick={() => onClickEdit(item)} key="draft_edit_btn"><EditOutlined /></CustomButton>]}
                >
                    <Skeleton avatar title={false} loading={false} active>
                        <List.Item.Meta
                        avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                        title={<a href="https://ant.design">{item.title}</a>}
                        description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                        />
                        <Typography.Text italic>{moment(item.createdAt).fromNow()}</Typography.Text>
                    </Skeleton>
                </List.Item>
            )}
        />
        </InfiniteScroll>
    )
}

export default DraftArticles;