import axios from "axios";
import {
  Currencies,
  KeyValObject,
  EvolutionResponse,
  EvolutionChartData,
  // DolarArgentinaResponse,
} from "../types";
import { AVAIABLE_CURRENCIES } from "../constants";
import lodash from "lodash";

export const fetchLocationCurrency = async () => {
  const { data } = await axios.get("https://ipapi.co/currency/");

  return data;
};

export const fetchDolarTurista = async () => {
  const { data } = await axios.get(
    "https://cors-solucion.herokuapp.com/https://api-dolar-argentina.herokuapp.com/api/dolarturista"
  );

  return {
    compra: parseInt(data.compra),
    venta: parseInt(data.venta),
    fecha: new Date(data.fecha),
  };
};

export const fetchBlueConvertionRate = async () => {
  const { data } = await axios.get("https://cors-solucion.herokuapp.com/https://api-dolar-argentina.herokuapp.com/api/dolarblue");

  return {
    compra: parseInt(data.compra),
    venta: parseInt(data.venta),
    fecha: new Date(data.fecha),
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

export const createCurrencyList = (
  fetchedCurrencies: KeyValObject
): Currencies => {
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
  const evolutionChartData = lodash(data)
    .groupBy((item) => {
      const date = new Date(item.date);
      return date.getUTCFullYear();
    })
    .map((year) => year.slice(0, 2))
    .flatten()
    .value()
    .reduce((arr, records) => {
      const date = new Date(records.date);
      const year = date.getUTCFullYear();
      arr[year] = arr[year] || { oficial: 0, blue: 0, year: year.toString() };

      if (records.source === "Oficial") arr[year].oficial = records.value_sell;
      else arr[year].blue = records.value_sell;

      return arr;
    }, <{ [key: number]: EvolutionChartData }>{});

  return Object.values(evolutionChartData).slice(4);
};
