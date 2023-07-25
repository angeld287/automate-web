import { Content } from 'antd/lib/layout/layout';
import React, { useCallback, useEffect } from 'react';
import { setModule } from '../../../features/userSession/userSessionSlice';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { Row, Tabs } from 'antd';

import type { TabsProps } from 'antd';

import CustomSearch from '../../../Components/CustomSearch';
import styles from './styles';
import { getBacklinks, selectBacklinks, startBacklinksSearch } from '../../../features/backlinks/backlinksSlice';
import BacklinksList from '../../../Components/App/BacklinksList';
import { BackklinksState } from '../../../interfaces/Enums/States';
import { CopyOutlined } from '@ant-design/icons';
import CustomButton from '../../../Components/CustomButton';

const Backlinks: React.FC = () => {
    const dispatch = useAppDispatch();
    const { backlinks } = useAppSelector(selectBacklinks);

    useEffect(() => {
        dispatch(setModule("seo"));
        dispatch(getBacklinks(BackklinksState.NEW));
    }, [])

    const searchBacklinks = useCallback((text: string) => {
        dispatch(startBacklinksSearch(text))
    }, []);

    const onChange = useCallback((key: string) => {
        //dispatch(getBacklinks(key));
    }, [])

    const copyFoodPrint = useCallback(() => {
        navigator.clipboard.writeText('inurl:litypitbulls.com "muerto"')
    }, []);

    const items: TabsProps['items'] = [
      {
        key: BackklinksState.NEW,
        label: BackklinksState.NEW,
        children: <Content><Row>
                <BacklinksList data={backlinks.filter(backlink => backlink.state === BackklinksState.NEW)}/>
            </Row></Content>,
      },
      {
        key: BackklinksState.LINKED,
        label: BackklinksState.LINKED,
        children: <Content><Row>
            <BacklinksList data={backlinks.filter(backlink => backlink.state === BackklinksState.LINKED)}/>
        </Row></Content>,
      },
      {
        key: BackklinksState.DISCARDED,
        label: BackklinksState.DISCARDED,
        children: <Content><Row>
            <BacklinksList data={backlinks.filter(backlink => backlink.state === BackklinksState.DISCARDED)}/>
        </Row></Content>,
      },
    ];

    return (
        <Content style={styles.container}>
            <Row>
                <h1>G🅾️🅾️🇬le 🔙 Links 🔗 👉 SEARCH 🔍 📙</h1> 
                <div style={styles.button}><CustomButton onClick={() => {copyFoodPrint()}}><CopyOutlined /></CustomButton></div>
            </Row>
            <CustomSearch placeholder='Type the long keyword' loading={false} onSearch={searchBacklinks}/>
            <Row>
                <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
            </Row>
        </Content>
    );
};

export default React.memo(Backlinks);