import { StepProps } from "antd";
import { ReactNode } from "react";
import { SubTitleContent } from "../../../interfaces/models/Article";
import IModal from "../../CustomModal/IModal";

export interface CustomStepProps extends StepProps {
    content: ReactNode
}
export default interface ISearchKeywordStepper extends IModal{
    subtitles: Array<SubTitleContent>;
    onNext: Function;
    title: string;
}