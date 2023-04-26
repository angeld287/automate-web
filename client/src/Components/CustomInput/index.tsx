import { Input } from 'antd';
import React, { FC } from 'react';
import { ICustomInput } from './ICustomInput';

const CustomInput: FC<ICustomInput> = ({ style, dataTestId, type, onChange, value, label, readOnly, size, defaultValue, onPressEnter }) => {
    return <Input {...{style, defaultValue, type, value, onChange, readOnly, onPressEnter}} data-testid={dataTestId} className="inpt-1" size={size ? size : "large"} placeholder={label} />
}

export default React.memo(CustomInput);