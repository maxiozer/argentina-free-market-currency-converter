import axios from "axios";
import lodash from "lodash";
import {
  AVAILABLE_CURRENCIES,
  CURRENCIES_URL,
  DOLAR_BLUE_URL,
  EVOLUTION_URL,
  LOCATION_CURRENCY_URL,
} from "./constants";
import {
  Currencies,
  EvolutionChartData,
  EvolutionResponse,
  KeyValObject,
} from "./types";
import firebase from "firebase/app";

export const fetchLocationCurrency = async () => {
  const { data } = await axios.get(LOCATION_CURRENCY_URL);

  return data;
};

export const fetchConversionRate = async () => {
  const { data } = await axios.get(DOLAR_BLUE_URL);

  const fecha = new Date(data.last_update);
  return {
    blue: {
      compra: parseInt(data.blue.value_buy),
      venta: parseInt(data.blue.value_sell),
      fecha,
    },
    oficial: {
      compra: parseInt(data.oficial.value_buy),
      venta: parseInt(data.oficial.value_sell),
      fecha,
    },
  };
};

export const fetchCurrencies = async () => {
  const { data } = await axios.get(CURRENCIES_URL);

  return data.rates;
};

export const fetchEvolution = async () => {
  const { data } = await axios.get<EvolutionResponse[]>(EVOLUTION_URL);

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
  const availableCurrencies = Object.keys(AVAILABLE_CURRENCIES).filter(
    (availableCurrency) => availableCurrency in fetchedCurrencies
  );

  const currencyList: Currencies = availableCurrencies.map(
    (availableCurrency: string) => {
      return {
        code: availableCurrency,
        name: `${AVAILABLE_CURRENCIES[availableCurrency]} (${availableCurrency})`,
        value: fetchedCurrencies[availableCurrency],
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

export const canShareUrl = () => navigator.share;
export const shareUrl = () => {
  if (!navigator.share) return;
  firebase.analytics().logEvent("click_on_share");

  const metaDescription =
    document
      .querySelector('meta[name="description"]')
      ?.getAttribute("content") || undefined;

  navigator.share({
    url: "https://conversordolarblue.com",
    title: document.title,
    text: metaDescription,
  });
};
