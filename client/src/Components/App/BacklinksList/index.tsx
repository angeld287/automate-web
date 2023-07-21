import { List } from 'antd';
import React from 'react';
import { IBacklinksResultList } from './IBacklinksResultList';
import BacklinkItem from './BacklinkItem';

const BacklinksList: React.FC<IBacklinksResultList> = ({ data }) => (
    <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item) => <BacklinkItem 
                                    createdBy={item.createdBy} 
                                    link={item.link} 
                                    rel={item.rel}
                                    state={item.state}
                                    id={item.id}
                                    />}
    />
);

export default React.memo(BacklinksList);