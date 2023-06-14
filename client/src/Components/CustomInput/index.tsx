import { Input } from 'antd';
import React, { FC } from 'react';
import { ICustomInput } from './ICustomInput';

const CustomInput: FC<ICustomInput> = (props) => {
    return <Input {...{...props}} data-testid={props.dataTestId} className="inpt-1" size={props.size ? props.size : "large"} placeholder={props.label} />
}

export default React.memo(CustomInput);