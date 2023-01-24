
import React, { memo } from 'react';

import { Col, Row } from 'antd';
import { ICustomSelectGroup } from './ICustomSelectGroup';
import CustomSelect from '../CustomSelect';

const CustomSelectGroup: React.FC<ICustomSelectGroup> = ({ name, label, defaultValue, disabled, items, placeholder, getItemsNextToken, onChange }) => {
    return <Row>
        <Col span={8} className="label">
            <label>{label}</label>
        </Col>
        <Col span={16}>
            <CustomSelect id={'select_id_' + name}
                dataTestId={'select_id_' + name}
                key={'select_id_' + name}
                style={{ marginBottom: 10 }}
                {...{name, items, placeholder, getItemsNextToken, disabled, defaultValue, onChange}}
                />
        </Col>
    </Row>;
}

export default memo(CustomSelectGroup);