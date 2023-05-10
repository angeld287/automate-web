import React, { useEffect } from 'react';
import { Card, List, Row, Space, Tag } from 'antd';
import moment from 'moment';
import { DeleteOutlined, LinkOutlined, OrderedListOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { getAllJobs, selectKeywordSearchJob } from '../../features/keywordSearchJob/keywordSearchJobSlice';
import { selectCategoriesUtils, getCategoryList } from '../../features/categories/categoriesSlice';
import Locals from '../../config/Locals';

const JobsList: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate()
    const { categories, statusc } = useAppSelector(selectCategoriesUtils);

    useEffect(() => {
        if(categories.length === 0) dispatch(getCategoryList());
        return () => {}
    },[]);

    const goToCateoryArticles = (category: string | undefined) => {
        navigate(`/category/${category}/articles`);
    }


    return (
        <Row>
            <List
                grid={{
                    gutter: 16
                }}
                dataSource={categories}
                renderItem={(item) => (
                    <List.Item key={item.id}>
                        <Card 
                            key={item.id}
                            style={{width: 220}} 
                            title={item.name.toUpperCase()}
                            actions={[<OrderedListOutlined onClick={() => {goToCateoryArticles(item.name)}} key="keywords" />, <a target='blank' href={`${Locals.config().WP_URL}${item.name}`}><LinkOutlined/></a>]}
                        >
                            <Row>
                                <Space size={[0, 8]} wrap>
                                    <Tag color="#87d068" key="number_of_items">Number of Items</Tag>
                                </Space>
                            </Row>
                        </Card>
                    </List.Item>
                )}
            />
        </Row>
      )
};

export default JobsList;