import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Table, Space } from 'antd';

import CustomButton from '../CustomButton';
import ICustomTable from './ICustomTable';
import { ICustomButton } from '../CustomButton/ICustomButton'

const CustomTable: React.FC<ICustomTable> = ({ headers, items, getItemsNextToken, itemsLoading }) => {
    const [index, setIndex] = useState(1)
    const [loading, setLoading] = useState(false)

    const _headers = useMemo(() => headers.map(header => {
        if (header.name !== 'Acciones') {
            return ({ title: header.name, dataIndex: header.name.toLowerCase(), key: header.name.toLowerCase(), sorter: header.sorter })
        } else {
            return ({
                title: header.name,
                key: header.name.toLowerCase(),
                dataIndex: header.name.toLowerCase(),
                render: (btns: Array<ICustomButton>) => (
                    <Space size="middle">{btns.map(btn => <CustomButton key={btn.id} {...btn} >{btn.text}</CustomButton>)}</Space>
                ),
            })
        }
    }), [headers]);

    const _items = useMemo(
        () => items.map(_ => ({ ..._, key: _.id })),
        [items]
    );

    const onChangeTable = async (e: any) => {
        setIndex(e.current);
        if (_items.length <= parseInt(e.pageSize) * parseInt(e.current) && getItemsNextToken !== undefined) {
            setLoading(true);
            await getItemsNextToken();
            setLoading(false);
        }
    }

    useEffect(() => {
        if(itemsLoading){
            setLoading(itemsLoading)
        }else{
            setLoading(false)
        }
        
    }, [itemsLoading]);

    return (
        <div style={{ marginTop: 20 }}>
            <Table
                scroll={{ y: 600 }}
                columns={_headers}
                dataSource={_items}
                pagination={{ current: index }}
                loading={loading}
                onChange={onChangeTable}
            />
        </div>
    )
}

export default React.memo(CustomTable);