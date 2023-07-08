import { Content } from 'antd/lib/layout/layout';
import React, { useEffect } from 'react';
import { setModule } from '../../../features/userSession/userSessionSlice';
import { useAppDispatch } from '../../../app/hooks';
const Backlinks: React.FC = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setModule("seo"))
    }, [])

    return (
        <Content>
            <h1>G🅾️🅾️🇬le 🔙 Links 🔗 👉 SEARCH 🔍 📙</h1>
        </Content>
    );
};

export default React.memo(Backlinks);