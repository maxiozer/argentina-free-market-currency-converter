export interface BluelyticsResponse {
  blue?: { value_avg: number; value_buy: number; value_sell: number };
  last_update: Date;
}
export interface EvolutionResponse {
  date: Date;
  source: "Oficial" | "Blue";
  value_sell: number;
  value_buy: number;
}

export interface DolarArgentinaResponse {
  compra: number;
  venta: number;
  fecha: Date;
}

export interface Currency {
  code: string;
  name: string;
  value: number;
}

export type Currencies = Currency[];

export type KeyValObject = { [key: string]: any };

export interface EvolutionChartData {
  year: string;
  oficial: number;
  blue: number;
}
