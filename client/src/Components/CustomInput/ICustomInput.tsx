import { InputProps } from "antd";

export interface ICustomInput extends InputProps {
    dataTestId: string,
    label: string,
}