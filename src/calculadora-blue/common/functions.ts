import axios from "axios";
import lodash from "lodash";
import {
  AVAIABLE_CURRENCIES,
  CURRENCIES_URL,
  DOLAR_BLUE_URL,
  DOLAR_OFICIAL_URL,
  DOLAR_TURISTA_URL,
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

const fetchFromDolarArgentina = async (url: string) => {
  const { data } = await axios.get(url);

  return {
    compra: parseInt(data.compra),
    venta: parseInt(data.venta),
    fecha: new Date(data.fecha),
  };
};

export const fetchDolarTurista = async () =>
  fetchFromDolarArgentina(DOLAR_TURISTA_URL);

export const fetchDolarOficial = async () =>
  fetchFromDolarArgentina(DOLAR_OFICIAL_URL);

export const fetchBlueConvertionRate = async () =>
  fetchFromDolarArgentina(DOLAR_BLUE_URL);

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
  const avaiableCurrencies = Object.keys(AVAIABLE_CURRENCIES).filter(
    (avaiableCurrency) => avaiableCurrency in fetchedCurrencies
  );

  const currencyList: Currencies = avaiableCurrencies.map(
    (avaiableCurrency: string) => {
      return {
        code: avaiableCurrency,
        name: `${AVAIABLE_CURRENCIES[avaiableCurrency]} (${avaiableCurrency})`,
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
