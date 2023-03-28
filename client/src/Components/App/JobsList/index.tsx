import React, { useEffect } from 'react';
import { Card, List } from 'antd';
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
    },[]);

    const onClickEdit = (jobId: number | undefined) => {
        navigate(`/jobs/${jobId}`);
    }

    return (
        <List
          grid={{
              gutter: 16
          }}
          dataSource={AllJobs}
          renderItem={(item) => (
            <List.Item>
                <Card 
                    style={{width: 220}} 
                    title={moment(item.createdAt).fromNow()}
                    actions={[<OrderedListOutlined onClick={() => {onClickEdit(item.id)}} key="keywords" />, <DeleteOutlined />]}
                >
                    {item.longTailKeyword}
                </Card>
            </List.Item>
          )}
        />
      )
};

export default JobsList;