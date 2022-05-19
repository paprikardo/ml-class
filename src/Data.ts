export interface IDataPoint {
  x: number;
  y: number;
}
export interface IDataGroup {
  id: string;
  data: IDataPoint[];
}

export interface IData {
  data: IDataGroup[];
  line: [number,number][];
}
