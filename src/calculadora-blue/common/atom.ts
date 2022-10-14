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
  async () =>
    fetchDolarTurista()
      .then((dolarturista) => {
        localStorage.setItem(
          "turista_convertion_rate",
          JSON.stringify(dolarturista)
        );
        return dolarturista;
      })
      .catch(() =>
        JSON.parse(localStorage.getItem("turista_convertion_rate") || "")
      )
);

export const getDolarBlueAtom = atom<Promise<DolarArgentinaResponse>>(
  async () =>
    fetchBlueConvertionRate()
      .then((dolarBlue) => {
        localStorage.setItem("blue_convertion_rate", JSON.stringify(dolarBlue));
        return dolarBlue;
      })
      .catch(() =>
        JSON.parse(localStorage.getItem("blue_convertion_rate") || "")
      )
);

export const getDolarQatarAtom = atom<Promise<DolarArgentinaResponse>>(
  async (get) => {
    const dolarTurista = get(getDolarTuristaAtom);
    return fetchDolarOficial()
      .then((dolarOficial) => {
        localStorage.setItem(
          "qatar_convertion_rate",
          JSON.stringify(dolarOficial)
        );
        return {
          ...dolarTurista,
          venta: Math.floor(dolarTurista.venta + dolarOficial.venta * 0.25),
        };
      })
      .catch(() =>
        JSON.parse(localStorage.getItem("qatar_convertion_rate") || "")
      );
  }
);

export const getCurrencyListAtom = atom<Promise<Currencies>>(async () =>
  fetchCurrencies().then((fetchedCurrencies) =>
    createCurrencyList(fetchedCurrencies)
  )
);

export const getEvolutionChartAtom = atom<Promise<EvolutionChartData[]>>(
  async () =>
    fetchEvolution()
      .then((evolution) => {
        const evolutionChartData = generateEvolutionChartData(evolution);
        localStorage.setItem(
          "evolution_chart",
          JSON.stringify(evolutionChartData)
        );

        return evolutionChartData;
      })
      .catch(() => JSON.parse(localStorage.getItem("evolution_chart") || ""))
);

export const currentTabAtom = atomWithStorage<number>("current_tab", 0);

export const changeCurrentTabAtom = atom(
  (get) => get(currentTabAtom),
  (get, set, newValue: number) => {
    if (newValue > TABS.length - 1 || newValue < 0) return;

    set(currentTabAtom, newValue);
  }
);
