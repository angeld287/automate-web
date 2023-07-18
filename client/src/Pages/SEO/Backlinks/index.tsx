import { Content } from 'antd/lib/layout/layout';
import React, { useCallback, useEffect } from 'react';
import { setModule } from '../../../features/userSession/userSessionSlice';
import { useAppDispatch } from '../../../app/hooks';
import { Row, Tabs } from 'antd';

import type { TabsProps } from 'antd';

import CustomSearch from '../../../Components/CustomSearch';
import styles from './styles';
import { startBacklinksSearch } from '../../../features/backlinks/backlinksSlice';

const Backlinks: React.FC = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setModule("seo"))
    }, [])

    const searchBacklinks = useCallback((text: string) => {
        dispatch(startBacklinksSearch(text))
    }, []);

    const onChange = useCallback((key: string) => {
        //console.log(key);
    }, [])

    const items: TabsProps['items'] = [
      {
        key: '1',
        label: `NEW`,
        children: <Content><Row>
                <h1>G🅾️🅾️🇬le 🔙 Links 🔗 👉 SEARCH 🔍 📙</h1>
            </Row></Content>,
      },
      {
        key: '2',
        label: `LINKED`,
        children: <h2>daniel</h2>,
      },
      {
        key: '3',
        label: `DISCARDED`,
        children: ``,
      },
    ];

    return (
        <Content style={styles.container}>
            <h1>G🅾️🅾️🇬le 🔙 Links 🔗 👉 SEARCH 🔍 📙</h1>
            <CustomSearch placeholder='Type the long keyword' loading={false} onSearch={searchBacklinks}/>
            <Row>
                <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
            </Row>
        </Content>
    );
};

export default React.memo(Backlinks);