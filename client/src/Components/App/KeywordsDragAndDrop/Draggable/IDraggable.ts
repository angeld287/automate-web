import React from "react";

export default interface IDraggable {
    id: string;
    children: React.ReactNode;
    dbId?: number;
}