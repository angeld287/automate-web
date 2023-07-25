import { List } from 'antd';
import React from 'react';
import { IBacklinksResultList } from './IBacklinksResultList';
import BacklinkItem from './BacklinkItem';

const BacklinksList: React.FC<IBacklinksResultList> = ({ data }) => (
    <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item) => <BacklinkItem {...item}/>}
    />
);

export default React.memo(BacklinksList);