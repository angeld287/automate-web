import { MoreOutlined } from '@ant-design/icons';
import { Avatar, List, Row, Tag } from 'antd';
import React, { useCallback } from 'react';
import CustomButton from '../../../CustomButton';
import IBacklink from '../../../../interfaces/models/IBacklink';

const BacklinkItem: React.FC<IBacklink> = ({ id, rel, link, state }) => {

    const goToLink = useCallback((link: string) => {
        window.location.href = link;
    }, [])

    return (
        <List.Item
            key={"item-position-" + id}
            actions={[
                <CustomButton onClick={e => { e.preventDefault(); goToLink(link) }} color='blue' icon={<MoreOutlined />}></CustomButton>
            ]}
        >
            <List.Item.Meta
                avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                title={<Row><p>Title: </p><a target="_blank" rel="noreferrer" href={link}>{state}</a></Row>}
                description={<>{rel.split(',').map(tag => <Tag color="#f50">{tag}</Tag>)}</>}
            />
        </List.Item>
    )
};

export default React.memo(BacklinkItem);