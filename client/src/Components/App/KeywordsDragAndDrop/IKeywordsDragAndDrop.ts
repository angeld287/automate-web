import { UniqueIdentifier } from "@dnd-kit/core";
import { ReactElement } from "react";
import IKeyword from "../../../interfaces/models/Keyword";

export interface IDragKeyword extends IKeyword {
    parent: UniqueIdentifier | null;
    component: ReactElement;
}

export default interface IKeywordsDragAndDrop {
    keywords: Array<IKeyword>
}