import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Container, CssBaseline, Toolbar } from "@material-ui/core";
import {
  BluelyticsResponse,
  Currencies,
  Currency,
  EvolutionChartData,
} from "./types";
import {
  fetchBlueConvertionRate,
  fetchCurrencies,
  createCurrencyList,
  fetchEvolution,
  generateEvolutionChartData,
  fetchLocationCurrency,
} from "./common";

import Header from "./components/Header";
import LoadingForm from "./components/LoadingForm";

import axios from "axios";
import PWAPrompt from "react-ios-pwa-prompt";
import { DEFAULT_CURRENCY, DEFAULT_CURRENCY_LIST_ITEM } from "./constants";
import { useLocalStorage } from "usehooks-ts";
import Calculadora from "./Calculadora";

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
  const [blueConvertionRate, setBlueConvertionRate] =
    useLocalStorage<BluelyticsResponse>("bluelytics_response", {});

  useEffect(() => {
    const fetchBlueConvertionRatePromise = fetchBlueConvertionRate().then(
      (blueConvertionRate) => setBlueConvertionRate(blueConvertionRate)
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
      .all([fetchBlueConvertionRatePromise, fetchCurrenciesPromise])
      .finally(() => {
        setIsLoading(false);
      });

    fetchEvolution().then((evolution) => {
      const evolutionChart = generateEvolutionChartData(evolution);
      setEvolutionChart(evolutionChart);
      setIsLoadingEvolutionChart(false);
    });
  }, []);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Header isLoading={isLoading}></Header>
      <Toolbar />
      <div className={classes.paper}>
        {isLoading && <LoadingForm />}
        {!isLoading && (
          <Fragment>
            <PWAPrompt timesToShow={3} permanentlyHideOnDismiss={false} />
            <Calculadora
              convertionRate={blueConvertionRate.blue}
              currencyList={currencyList} // lista de monedas y precios
              currencyToConvert={currencyToConvert}
              setCurrencyToConvert={setCurrencyToConvert}
              isLoadingEvolutionChart={isLoadingEvolutionChart}
              evolutionChart={evolutionChart}
            />
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
