export interface BluelyticsResponse {
  blue?: { value_avg: number; value_buy: number; value_sell: number };
}

export interface Currency {
  code: string;
  name: string;
  value: number;
}

export type Currencies = Currency[];

export type KeyValObject = { [key: string]: any };
