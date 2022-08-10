import React, {
  useState,
  useEffect,
  useRef,
  Fragment,
  useCallback,
} from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Container,
  Grid,
  TextField,
  CssBaseline,
  Toolbar,
  Divider,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {
  BluelyticsResponse,
  Currencies,
  Currency,
  EvolutionChartData,
} from "./types";
import {
  fetchBlueConvertionRate,
  fetchCurrencies,
  convertFromArs,
  convertToArs,
  createCurrencyList,
  fetchEvolution,
  generateEvolutionChartData,
  fetchLocationCurrency,
} from "./common";

import Header from "./components/Header";
import CurrencyValues from "./components/CurrencyValue";
import LastUpdate from "./components/LastUpdate";
import LoadingForm from "./components/LoadingForm";
import EvolutionChart from "./components/EvolutionChart";

import firebase from "firebase/app";
import axios from "axios";
import PWAPrompt from "react-ios-pwa-prompt";
import { DEFAULT_CURRENCY, DEFAULT_CURRENCY_LIST_ITEM } from "./constants";
import { useLocalStorage } from "usehooks-ts";
import AdSense from "react-adsense";

export default function CalculadoraBlue() {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(true);
  const isConvertingToArs = useRef(false);
  const [isLoadingEvolutionChart, setIsLoadingEvolutionChart] = useState(true);

  const [arsToConvert, setArsToConvert] = useState(1);
  const [convertedAmount, setConvertedAmount] = useState(0);
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
    if (blueConvertionRate && blueConvertionRate.blue)
      setArsToConvert(blueConvertionRate.blue?.value_sell);
  }, [blueConvertionRate]);

  
  useEffect(() => {
    const fetchBlueConvertionRatePromise = fetchBlueConvertionRate()
      .then((blueConvertionRate) => setBlueConvertionRate(blueConvertionRate));

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

  useEffect(() => {
    if (isConvertingToArs.current) {
      isConvertingToArs.current = false;
    } else if (currencyToConvert && blueConvertionRate.blue) {
      const convertedAmount = convertFromArs(
        arsToConvert,
        blueConvertionRate.blue.value_buy,
        currencyToConvert.value
      );
      setConvertedAmount(convertedAmount);
    }
  }, [currencyToConvert, arsToConvert, blueConvertionRate]);

  const handleCurrencyToConvertChange = useCallback(
    (event: any, newValue: Currency | null) => {
      if (newValue) {
        const currencyToConvert: Currency | undefined = currencyList.find(
          (currency) => currency.code === (newValue.code as string)
        );

        firebase.analytics().logEvent("currency_to_convert_change", {
          currency: newValue.code,
        });
        setCurrencyToConvert(currencyToConvert);
      }
    },
    [currencyList]
  );

  const handleArsToConvertChange = useCallback(
    (event: React.ChangeEvent<{ value: unknown }>) => {
      firebase
        .analytics()
        .logEvent("covert_from_ars", { amount: event.target.value });

      setArsToConvert(event.target.value as number);
    },
    []
  );

  const handleConvertedAmountChange = useCallback(
    (event: React.ChangeEvent<{ value: unknown }>) => {
      const convertedAmount = event.target.value as number;

      if (currencyToConvert && blueConvertionRate.blue) {
        const ars = convertToArs(
          convertedAmount,
          blueConvertionRate.blue.value_sell,
          currencyToConvert.value
        );

        firebase
          .analytics()
          .logEvent("covert_to_ars", { amount: event.target.value });

        isConvertingToArs.current = true;
        setArsToConvert(ars);
      }

      setConvertedAmount(convertedAmount);
    },
    [blueConvertionRate.blue, currencyToConvert]
  );

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
            <Grid container spacing={2}>
              <Grid container item spacing={1}>
                <Grid item xs={12} sm={12}>
                  <CurrencyValues blueConvertionRate={blueConvertionRate} />
                  <LastUpdate />
                </Grid>
              </Grid>
              <Grid container item spacing={1}>
                <Grid item xs={5} sm={6}>
                  <TextField
                    type="number"
                    value={convertedAmount}
                    onChange={handleConvertedAmountChange}
                  />
                </Grid>
                <Grid item xs={7} sm={6}>
                  <Autocomplete
                    id="currency-to-convert"
                    options={currencyList}
                    disableClearable
                    selectOnFocus
                    value={currencyToConvert}
                    getOptionLabel={(option) => option.name}
                    getOptionSelected={(option, value) =>
                      option.code === value.code
                    }
                    onChange={handleCurrencyToConvertChange}
                    className={classes.select}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Grid>
                <Grid item xs={5} sm={6}>
                  <TextField
                    type="number"
                    autoFocus
                    onChange={handleArsToConvertChange}
                    value={arsToConvert}
                  />
                </Grid>
                <Grid item xs={7} sm={6}>
                  <TextField
                    type="text"
                    value="Pesos Argentinos"
                    disabled={true}
                  />
                </Grid>
              </Grid>
              <Grid item xs={12} sm={12}>
                <Divider variant="middle" />
              </Grid>
              <Grid item xs={12} sm={12}>
                {/* <AdSense.Google
                  className="adsbygoogle"
                  client="ca-pub-2491944144260352"
                  slot="5159911770"
                  style={{ display: "block" }}
                  responsive="true"
                  format="auto"
                /> */}
                <EvolutionChart
                  data={evolutionChart}
                  isLoading={isLoadingEvolutionChart}
                />
              </Grid>
            </Grid>
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
  select: {
    minWidth: "calc(100%)",
    maxWidth: "calc(100%)",
  },
}));
