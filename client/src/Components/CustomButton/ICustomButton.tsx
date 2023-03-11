import { ButtonProps } from 'antd';

export interface ICustomButton extends ButtonProps {
    _key: string;
    id?: string;
    onClicAction?: Function;
    text?: string;
}