import axios from "axios";
import { BluelyticsResponse, Currencies, KeyValObject } from "../types";
import { AVAIABLE_CURRENCIES } from "../constants";

export const fetchBlueConvertionRate = async () => {
  const { data } = await axios.get<BluelyticsResponse>(
    "https://api.bluelytics.com.ar/v2/latest"
  );

  return data;
};

export const fetchCurrencies = async () => {
  const { data } = await axios.get(
    "https://api.exchangerate.host/latest?base=USD&places=2"
  );

  return data.rates;
};

export const convertFromArs = (
  arsToConvert: number,
  usdBlueValue: number,
  currencyToConvertValue: number
): number => {
  const convertedInUsd = arsToConvert / usdBlueValue;
  const convertedAmount = convertedInUsd * currencyToConvertValue;
  return Math.round(convertedAmount * 100) / 100;
};

export const convertToArs = (
  valueToConvert: number,
  usdBlueValue: number,
  currencyToConvertValue: number
): number => {
  const convertedInUsd = valueToConvert / currencyToConvertValue;
  const convertedAmount = convertedInUsd * usdBlueValue;
  return Math.round(convertedAmount * 100) / 100;
};

export const createCurrencyList = (
  fetchedCurrencies: KeyValObject
) => {
  const avaiableCurrencies = Object.keys(AVAIABLE_CURRENCIES).filter(
    (avaiableCurrency) => avaiableCurrency in fetchedCurrencies
  );

  const currencyList: Currencies = avaiableCurrencies.map(
    (avaiableCurrency: string) => {
      return {
        code: avaiableCurrency,
        name: AVAIABLE_CURRENCIES[avaiableCurrency],
        value: fetchedCurrencies[avaiableCurrency],
      };
    }
  );

  return currencyList;
};
