import React, { memo } from 'react';

import { Input, Col, Row } from 'antd';
import { ICustomInputGroup } from './ICustomInputGroup';
import './CustomInputGroup.css'

const CustomInputGroup: React.FC<ICustomInputGroup> = (props) => {
    return <Row>
        <Col span={6} className="label" style={{textAlign: 'right', marginRight: 5}}>
            <label>{props.label}</label>
        </Col>
        <Col span={17}>
            <Input placeholder={"Type your " + props.label} {...{...props}}/>
        </Col>
    </Row>
}

export default memo(CustomInputGroup);