import React, { FC } from 'react';
import { Input } from 'antd';
import ICustomSearch from './ICustomSearch';
const { Search } = Input;

const CustomSearch: FC<ICustomSearch> = ({ placeholder, onSearch, loading }) => (
    <>
        <Search placeholder={placeholder} enterButton="Search" size="large" loading={loading} onSearch={onSearch} allowClear />
    </>
);

export default CustomSearch;