import React from 'react';
import { Input } from 'antd';
import ICustomTextArea from './ICustomTextArea';

const { TextArea } = Input;

const CustomTextArea: React.FC<ICustomTextArea> = ({value, dataTestId, label, rows, onChange}) => <TextArea 
                rows={rows} 
                placeholder={label} 
                value={value}
                onChange={onChange}/>;

export default CustomTextArea;