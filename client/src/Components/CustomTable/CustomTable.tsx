import React, { useEffect, useState, useMemo } from 'react';
import { Table, Space } from 'antd';

import CustomButton from '../CustomButton';
import ICustomTable from './ICustomTable';
import { IAction } from '../App/KeywordsList/IKeywordsList';
import CustomSelect from '../CustomSelect';

const CustomTable: React.FC<ICustomTable> = ({ headers, items, getItemsNextToken, itemsLoading }) => {
    const [index, setIndex] = useState(1)
    const [loading, setLoading] = useState(false)

    const _headers = useMemo(() => headers.map(header => {
        if (header.name !== 'Actions') {
            return ({ 
                    title: header.name, 
                    dataIndex: header.name.toLowerCase(), 
                    key: header.name.toLowerCase(), 
                    ...header
                })
        } else {
            return ({
                title: header.name,
                key: header.name.toLowerCase(),
                dataIndex: header.name.toLowerCase(),
                render: (actions: Array<IAction>) => (
                    <Space size="middle">{actions.map(action => {
                        return action.type === "button" ? 
                        <CustomButton key={action.component._key} {...action.component} >{action.component.text}</CustomButton> 
                        : <CustomSelect placeholder="Category" key={action.component._key} {...action.component}/>
                    }
                    )}</Space>
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