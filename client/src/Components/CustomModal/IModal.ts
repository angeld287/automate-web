import { Dispatch, ReactNode, SetStateAction } from "react";

export default interface IModal {
    open: boolean | undefined;
    setOpen: Function | Dispatch<SetStateAction<Boolean>>;
    onOk?: Function;
    width?: string | number | undefined;
    style?: React.CSSProperties;
    children?: any;
    title?: string;
    footer?: ReactNode;
    confirmLoading?: boolean;
}