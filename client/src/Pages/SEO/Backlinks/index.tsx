import { Content } from 'antd/lib/layout/layout';
import React, { useCallback, useEffect } from 'react';
import { setModule } from '../../../features/userSession/userSessionSlice';
import { useAppDispatch } from '../../../app/hooks';
import { Row } from 'antd';
import CustomInputGroup from '../../../Components/CustomInputGroup';
import CustomInput from '../../../Components/CustomInput';
import CustomSearch from '../../../Components/CustomSearch';
import styles from './styles';
const Backlinks: React.FC = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setModule("seo"))
    }, [])

    const searchBacklinks = useCallback(() => {

    }, []);

    return (
        <Content style={styles.container}>
            <h1>G🅾️🅾️🇬le 🔙 Links 🔗 👉 SEARCH 🔍 📙</h1>
            <CustomSearch placeholder='Type the long keyword' loading={false} />
            <Row>
                
            </Row>
        </Content>
    );
};

export default React.memo(Backlinks);