import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import {
  createCurrencyList,
  fetchBlueConvertionRate,
  fetchCurrencies,
  fetchDolarOficial,
  fetchDolarTurista,
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
  DolarArgentinaResponse,
  EvolutionChartData,
} from "./types";

const TURISTA_LS_KEY = "turista";
const BLUE_LS_KEY = "blue";
const QATAR_LS_KEY = "qatar";
const EVOLUTION_CHART_LS_KEY = "evolution_chart";
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

export const getDolarTuristaAtom = atom<Promise<DolarArgentinaResponse>>(
  async () => fetchDolarTurista()
);

export const getDolarBlueAtom = atom<Promise<DolarArgentinaResponse>>(
  async () => fetchBlueConvertionRate()
);

export const getDolarQatarAtom = atom<Promise<DolarArgentinaResponse>>(
  async (get) => {
    const dolarTurista = get(getDolarTuristaAtom);
    return fetchDolarOficial().then((dolarOficial) => {
      localStorage.setItem(QATAR_LS_KEY, JSON.stringify(dolarOficial));
      return {
        ...dolarTurista,
        venta: Math.floor(dolarTurista.venta + dolarOficial.venta * 0.25),
      };
    });
  }
);

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
