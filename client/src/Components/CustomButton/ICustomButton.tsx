import { ButtonProps } from 'antd';
import { MouseEventHandler, ReactNode } from 'react'

export interface ICustomButton extends ButtonProps {
    _key: string;
}