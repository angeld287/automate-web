import React, { useEffect, useState } from 'react';
import { Card, Col, List, Row, Space, Tag } from 'antd';
import { LinkOutlined, OrderedListOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectCategoriesUtils, getCategoryList, createCategory } from '../../features/categories/categoriesSlice';
import Locals from '../../config/Locals';
import CustomButton from '../../Components/CustomButton';
import CustomModal from '../../Components/CustomModal';
import CustomInputGroup from '../../Components/CustomInputGroup';
import { replaceSpace } from '../../utils/functions';

const JobsList: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');

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

    const site = localStorage.getItem('default-site');


    return (
        <>
            <Row>
                <Col style={{margin: 10}}><CustomButton onClick={() => { setOpen(true)}}>Create Category</CustomButton></Col>
            </Row>
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
                                        <Tag color="#87d068" key="number_of_items"><h2>{item.count} Articles</h2></Tag>
                                    </Space>
                                </Row>
                            </Card>
                        </List.Item>
                    )}
                />
            </Row>
            <CustomModal {...{open, setOpen}} title="Create Category" width={800} onOk={() => {
                dispatch(createCategory({
                    name: name,
                    slug: replaceSpace(name.trim().toLowerCase()),
                    siteId: site === null ? 0 : parseInt(site)
                }));
                setOpen(false)
            }}>
                <CustomInputGroup value={name} defaultValue={name} onChange={(e) => setName(e.target.value)} label="Category Name"></CustomInputGroup>
            </CustomModal>
        </>
      )
};

export default JobsList;