import React, { memo } from 'react';

import { Input, Col, Row } from 'antd';
import { ICustomInputGroup } from './ICustomInputGroup';
import './CustomInputGroup.css'

const CustomInputGroup: React.FC<ICustomInputGroup> = ({ label, defaultValue, disabled, type, onChange }) => {
    return <Row>
        <Col span={4} className="label">
            <label>{label}</label>
        </Col>
        <Col span={20}>
            <Input type={type} placeholder={"Type your " + label} {...{onChange, defaultValue, disabled}}/>
        </Col>
    </Row>
}

export default memo(CustomInputGroup);