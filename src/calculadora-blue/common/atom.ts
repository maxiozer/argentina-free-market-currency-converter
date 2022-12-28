import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import {
  createCurrencyList,
  fetchConversionRate,
  fetchCurrencies,
  fetchEvolution,
  fetchLocationCurrency,
  generateEvolutionChartData,
} from "./functions";
import {
  DEFAULT_CURRENCY,
  DEFAULT_CURRENCY_LIST_ITEM,
  TABS,
} from "./constants";
import {
  Currencies,
  Currency,
  ConversionRate,
  EvolutionChartData,
} from "./types";

const CURRENT_TAB_LS_KEY = "current_tab";

export const currencyToConvertAtom = atomWithStorage<Currency | undefined>(
  "currency_to_convert",
  DEFAULT_CURRENCY_LIST_ITEM
);

export const currencyListAtom = atom<Currencies>([]);

export const getLocationCurrencyAtom = atom(async () =>
  fetchLocationCurrency()
    .then((fetchedLocationCurrency) =>
      fetchedLocationCurrency === "ARS"
        ? DEFAULT_CURRENCY
        : fetchedLocationCurrency
    )
    .catch(() => DEFAULT_CURRENCY)
);

export const getDolarTuristaAtom = atom<Promise<ConversionRate>>(async () => {
  const rate = await fetchConversionRate();
  const impuestoPais = 0.3;
  const impuestoGanancias = 0.45;

  return {
    ...rate.oficial,
    compra: 0,
    venta: Math.round(
      rate.oficial.venta +
        rate.oficial.venta * impuestoPais +
        rate.oficial.venta * impuestoGanancias
    ),
  };
});

export const getDolarBlueAtom = atom<Promise<ConversionRate>>(async () => {
  const rate = await fetchConversionRate();
  return rate.blue;
});

export const getDolarQatarAtom = atom<Promise<ConversionRate>>(async (get) => {
  const dolarTurista = get(getDolarTuristaAtom);
  return fetchConversionRate().then((dolar) => {
    return {
      ...dolarTurista,
      venta: Math.floor(dolarTurista.venta + dolar.oficial.venta * 0.25),
      compra: 0,
    };
  });
});

export const getCurrencyListAtom = atom<Promise<Currencies>>(async () =>
  fetchCurrencies().then((fetchedCurrencies) =>
    createCurrencyList(fetchedCurrencies)
  )
);

export const getEvolutionChartAtom = atom<Promise<EvolutionChartData[]>>(
  async () =>
    fetchEvolution().then((evolution) => generateEvolutionChartData(evolution))
);

export const currentTabAtom = atomWithStorage<number>(CURRENT_TAB_LS_KEY, 0);

export const changeCurrentTabAtom = atom(
  (get) => get(currentTabAtom),
  (_get, set, newValue: number) => {
    if (newValue > TABS.length - 1 || newValue < 0) return;

    set(currentTabAtom, newValue);
  }
);
