import { ChangeEventHandler } from "react";

export default interface ICustomTextArea {
    dataTestId: string;
    onChange: ChangeEventHandler<HTMLTextAreaElement>;
    value: string;
    label: string;
    readOnly: boolean;
    size: string;
    rows: number;
}