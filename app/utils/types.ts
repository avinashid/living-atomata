export type Point = {
  x: number;
  y: number;
};

export interface Cell extends Point {
  style?: CellStyle;
  attribute?: string;
}
export type CellStyle = {
  color?: string;
  stroke?: number;
  strokeColor?: string;
};

export type Spin = "up" | "down" | "left" | "right";
