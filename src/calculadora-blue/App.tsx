import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Container, CssBaseline, Toolbar } from "@material-ui/core";
import {
  Currencies,
  Currency,
  DolarArgentinaResponse,
  EvolutionChartData,
} from "./types";
import {
  fetchBlueConvertionRate,
  fetchCurrencies,
  createCurrencyList,
  fetchEvolution,
  generateEvolutionChartData,
  fetchLocationCurrency,
  fetchDolarTurista,
} from "./common";

import Header from "./components/Header";
import LoadingForm from "./components/LoadingForm";

import axios from "axios";
import PWAPrompt from "react-ios-pwa-prompt";
import { DEFAULT_CURRENCY, DEFAULT_CURRENCY_LIST_ITEM } from "./constants";
import { useLocalStorage } from "usehooks-ts";
import Calculadora from "./Calculadora";
import TabPanel from "./components/TabPanel";

export default function App() {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingEvolutionChart, setIsLoadingEvolutionChart] = useState(true);

  const [currencyToConvert, setCurrencyToConvert] = useLocalStorage<
    Currency | undefined
  >("currency_to_convert", DEFAULT_CURRENCY_LIST_ITEM);
  const [currencyList, setCurrencyList] = useState<Currencies>([]);
  const [evolutionChart, setEvolutionChart] = useState<EvolutionChartData[]>(
    []
  );
  const [blueConvertionRate, setBlueConvertionRate] = useLocalStorage<
    DolarArgentinaResponse | undefined
  >("blue_convertion_rate", undefined);

  const [turistaConvertionRate, setTuristaConvertionRate] = useLocalStorage<
    DolarArgentinaResponse | undefined
  >("turista_convertion_rate", undefined);

  useEffect(() => {
    const fetchBlueConvertionRatePromise = fetchBlueConvertionRate().then(
      (blueConvertionRate) => setBlueConvertionRate(blueConvertionRate)
    );
    const fetchTuristaConvertionRatePromise = fetchDolarTurista().then(
      (convertionRate) => setTuristaConvertionRate(convertionRate)
    );

    const fetchCurrenciesPromise = fetchCurrencies()
      .then((fetchedCurrencies) => {
        const currencyList = createCurrencyList(fetchedCurrencies);
        setCurrencyList(currencyList);

        return currencyList;
      })
      .then((currencyList) => {
        if (currencyToConvert === DEFAULT_CURRENCY_LIST_ITEM) {
          fetchLocationCurrency()
            .then((fetchedLocationCurrency) => {
              const defaultLocationCurrency =
                fetchedLocationCurrency === "ARS"
                  ? DEFAULT_CURRENCY
                  : fetchedLocationCurrency;

              const defaultCurrencyToConvert: Currency | undefined =
                currencyList.find(
                  (currency: Currency) =>
                    currency.code === defaultLocationCurrency
                );

              setCurrencyToConvert(defaultCurrencyToConvert);
            })
            .catch(() => {
              const defaultCurrencyToConvert: Currency | undefined =
                currencyList.find(
                  (currency: Currency) => currency.code === DEFAULT_CURRENCY
                );
              setCurrencyToConvert(defaultCurrencyToConvert);
            });
        }
      });

    axios
      .all([
        fetchTuristaConvertionRatePromise,
        fetchBlueConvertionRatePromise,
        fetchCurrenciesPromise,
      ])
      .finally(() => {
        setIsLoading(false);
      });

    fetchEvolution().then((evolution) => {
      const evolutionChart = generateEvolutionChartData(evolution);
      setEvolutionChart(evolutionChart);
      setIsLoadingEvolutionChart(false);
    });
  }, []);

  const [tabId, setTabId] = useState(0);
  const onTabChange = (event: unknown, newValue: number) => {
    setTabId(newValue);
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Header
        isLoading={isLoading}
        tabId={tabId}
        onTabChange={onTabChange}
      ></Header>
      <Toolbar />
      <Toolbar />
      <div className={classes.paper}>
        {isLoading && <LoadingForm />}
        {!isLoading && blueConvertionRate && turistaConvertionRate && (
          <Fragment>
            <PWAPrompt timesToShow={3} permanentlyHideOnDismiss={false} />
            <TabPanel value={tabId} index={0}>
              <Calculadora
                buyPrice={blueConvertionRate.compra}
                sellPrice={blueConvertionRate.venta}
                lastUpdate={blueConvertionRate.fecha}
                currencyList={currencyList} // lista de monedas y precios
                currencyToConvert={currencyToConvert}
                setCurrencyToConvert={setCurrencyToConvert}
                isLoadingEvolutionChart={isLoadingEvolutionChart}
                evolutionChart={evolutionChart}
              />
            </TabPanel>
            <TabPanel value={tabId} index={1}>
              <Calculadora
                buyPrice={turistaConvertionRate.compra}
                sellPrice={turistaConvertionRate.venta}
                lastUpdate={turistaConvertionRate.fecha}
                currencyList={currencyList} // lista de monedas y precios
                currencyToConvert={currencyToConvert}
                setCurrencyToConvert={setCurrencyToConvert}
                isLoadingEvolutionChart={isLoadingEvolutionChart}
                evolutionChart={evolutionChart}
              />
            </TabPanel>
          </Fragment>
        )}
      </div>
    </Container>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
}));
