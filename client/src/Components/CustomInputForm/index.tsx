import React, { memo } from 'react';

import { Input, Form } from 'antd';
import { ICustomInputGroup } from './ICustomInputForm';

const CustomInputForm: React.FC<ICustomInputGroup> = ({ name, label, defaultValue, disabled, type }) => {
    return <Form.Item {...{name, label}} initialValue={defaultValue} ><Input placeholder={"Type your " + label} {...{type, disabled}} /></Form.Item>;
}

export default memo(CustomInputForm);