
export type Datum = Record<string, any>;

export interface RangePoint {
    readonly x?: number | number[];
    readonly y?: number | number[];
}

export interface Point {
    readonly x: number;
    readonly y: number;
}

export declare type ShapeVertices = RangePoint[] | Point[] | Point[][];

export interface MappingDatum {
    /**
     * @title 原始数据
     */
    _origin: Datum;
    /**
     * @title shape 的关键点信息
     */
    points?: ShapeVertices;
    /**
     * @title 相对于当前 shape 的下一个 shape 的关键点信息
     */
    nextPoints?: ShapeVertices;
    /**
     * @title x 轴的坐标
     */
    x?: number[] | number;
    /**
     * @title y 轴的坐标
     */
    y?: number[] | number;
    /**
     * @title 颜色
     */
    color?: string;
    /**
     * @title 渲染的 shape 类型
     */
    shape?: string | string[];
    /**
     * @title 大小
     */
    size?: number;
}