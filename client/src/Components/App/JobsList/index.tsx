import React, { useEffect } from 'react';
import { Card, List, Row, Space, Tag } from 'antd';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { getAllJobs, selectKeywordSearchJob } from '../../../features/keywordSearchJob/keywordSearchJobSlice';
import moment from 'moment';
import { DeleteOutlined, OrderedListOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const JobsList: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate()
    const { AllJobs } = useAppSelector(selectKeywordSearchJob);

    useEffect(() => {
        if(AllJobs.length === 0) dispatch(getAllJobs());
        return () => {}
    },[AllJobs.length, dispatch]);

    const onClickEdit = (jobId: number | undefined) => {
        navigate(`/site/jobs/${jobId}`);
    }

    return (
        <List
          grid={{
              gutter: 16
          }}
          dataSource={AllJobs}
          renderItem={(item) => (
            <List.Item key={item.id}>
                <Card 
                    key={item.id}
                    style={{width: 220}} 
                    title={moment(item.createdAt).fromNow()}
                    actions={[<OrderedListOutlined onClick={() => {onClickEdit(item.id)}} key="keywords" />, <DeleteOutlined />]}
                >
                    <Row>{item.longTailKeyword}</Row>
                    <Row>
                        <Space size={[0, 8]} wrap>
                            {item.mainKeywords?.split(",").map(keyword => <Tag color="#87d068" key={keyword}>{keyword}</Tag>)}
                        </Space>
                    </Row>
                </Card>
            </List.Item>
          )}
        />
      )
};

export default JobsList;