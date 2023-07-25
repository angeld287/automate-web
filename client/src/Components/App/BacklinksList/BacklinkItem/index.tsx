import { MoreOutlined } from '@ant-design/icons';
import { Avatar, List, Row, Tag } from 'antd';
import React, { useCallback } from 'react';
import CustomButton from '../../../CustomButton';
import IBacklink from '../../../../interfaces/models/IBacklink';

const BacklinkItem: React.FC<IBacklink> = ({ id, rel, link, state, title, snippet }) => {

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
                style={{width: 700}}
                avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                title={<Row><a target="_blank" rel="noreferrer" href={link}>{title}</a></Row>}
                description={<>
                    <div style={{textAlign: "left"}}>
                        <p>{snippet}</p>
                        {rel.split(',').map(tag => <Tag color="#f50">{tag}</Tag>)}
                    </div>
                </>}
            />
        </List.Item>
    )
};

export default React.memo(BacklinkItem);