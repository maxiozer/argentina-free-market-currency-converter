import axios from "axios";
import {
  Currencies,
  KeyValObject,
  EvolutionResponse,
  EvolutionChartData,
} from "../types";
import { AVAIABLE_CURRENCIES } from "../constants";
import { blue } from "@material-ui/core/colors";

export const fetchLocationCurrency = async () => {
  const { data } = await axios.get("https://ipapi.co/currency/");

  return data;
};

export const fetchBlueConvertionRate = async () => {
  const { data } = await axios.get("https://api.bluelytics.com.ar/v2/latest");

  return {
    ...data,
    blue: {
      ...blue,
      value_sell: Math.round(data.blue.value_sell),
      value_buy: Math.round(data.blue.value_buy),
    },
  };
};

export const fetchCurrencies = async () => {
  const { data } = await axios.get(
    "https://api.exchangerate.host/latest?base=USD&places=2"
  );

  return data.rates;
};

export const fetchEvolution = async () => {
  const { data } = await axios.get<EvolutionResponse[]>(
    "https://api.bluelytics.com.ar/v2/evolution.json"
  );

  return data;
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

export const createCurrencyList = (fetchedCurrencies: KeyValObject) => {
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

export const generateEvolutionChartData = (
  data: EvolutionResponse[]
): EvolutionChartData[] => {
  const currentYear = new Date().getFullYear();
  const emptyChartByYear = {
    oficial: { sum: 0, count: 0 },
    blue: { sum: 0, count: 0 },
  };

  const chartByYear = data.reduce<{
    [key: number]: typeof emptyChartByYear;
  }>((retData, data) => {
    const year = new Date(data.date).getFullYear();
    const retYear = retData[year] || { ...emptyChartByYear };

    if (data.source === "Oficial")
      retYear.oficial = {
        sum: retYear.oficial.sum + data.value_sell,
        count: retYear.oficial.count + 1,
      };
    else
      retYear.blue = {
        sum: retYear.blue.sum + data.value_sell,
        count: retYear.blue.count + 1,
      };

    retData[year] = retYear;
    return retData;
  }, {});

  return Object.keys(chartByYear)
    .filter((year: string) => Number(year) >= currentYear - 7)
    .map((year: string) => {
      const yearInt = Number(year);
      return {
        year,
        oficial: Math.round(
          chartByYear[yearInt].oficial.sum / chartByYear[yearInt].oficial.count
        ),
        blue: Math.round(
          chartByYear[yearInt].blue.sum / chartByYear[yearInt].blue.count
        ),
      };
    });
};
