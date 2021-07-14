import React, { useState, useEffect, useRef, Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Container,
  Grid,
  MenuItem,
  Select,
  TextField,
  CssBaseline,
  Toolbar,
} from "@material-ui/core";
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

export default function CalculadoraBlue() {
  const classes = useStyles();
  const isConvertingToArs = useRef(false);
  const [arsToConvert, setArsToConvert] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [currencyToConvert, setCurrencyToConvert] = useState<Currency>();
  const [currencyList, setCurrencyList] = useState<Currencies>([]);
  const [isLoadingEvolutionChart, setIsLoadingEvolutionChart] = useState(true);
  const [evolutionChart, setEvolutionChart] = useState<EvolutionChartData[]>(
    []
  );
  const [blueConvertionRate, setBlueConvertionRate] =
    useState<BluelyticsResponse>({});

  const componentMount = async () => {
    const blueConvertionRate = await fetchBlueConvertionRate();
    setBlueConvertionRate(blueConvertionRate);

    const fetchedCurrencies = await fetchCurrencies();

    const currencyList = createCurrencyList(fetchedCurrencies);
    setCurrencyList(currencyList);

    const locationCurrency = await fetchLocationCurrency();
    const defaultLocationCurrency =
      !locationCurrency || locationCurrency === "ARS"
        ? "USD"
        : locationCurrency;

    const defaultCurrencyToConvert: Currency | undefined = currencyList.find(
      (currency: Currency) => currency.code === defaultLocationCurrency
    );
    setCurrencyToConvert(defaultCurrencyToConvert);

    if (blueConvertionRate && blueConvertionRate.blue)
      setArsToConvert(blueConvertionRate.blue?.value_sell);

    setIsLoading(false);

    setIsLoadingEvolutionChart(true);
    const evolution = await fetchEvolution();
    const evolutionChart = generateEvolutionChartData(evolution);
    setEvolutionChart(evolutionChart);
    setIsLoadingEvolutionChart(false);
  };

  useEffect(() => {
    componentMount();
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

  const handleCurrencyToConvertChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const currencyToConvert: Currency | undefined = currencyList.find(
      (currency) => currency.code === (event.target.value as string)
    );

    firebase.analytics().logEvent("Currency_to_convert_change", {
      currency: event.target.value,
    });

    setCurrencyToConvert(currencyToConvert);
  };

  const handleArsToConvertChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    firebase
      .analytics()
      .logEvent("covert_from_ars", { value: event.target.value });

    setArsToConvert(event.target.value as number);
  };

  const handleConvertedAmountChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const convertedAmount = event.target.value as number;

    if (currencyToConvert && blueConvertionRate.blue) {
      const ars = convertToArs(
        convertedAmount,
        blueConvertionRate.blue.value_sell,
        currencyToConvert.value
      );

      firebase
        .analytics()
        .logEvent("covert_to_ars", { value: event.target.value });

      isConvertingToArs.current = true;
      setArsToConvert(ars);
    }

    setConvertedAmount(convertedAmount);
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Header isLoading={isLoading}></Header>
      <Toolbar />
      <div className={classes.paper}>
        {isLoading ? (
          <LoadingForm />
        ) : (
          <Fragment>
            <CurrencyValues blueConvertionRate={blueConvertionRate} />
            <LastUpdate />
            <Grid container spacing={2}>
              <Grid item xs={6} sm={6}>
                <TextField
                  type="number"
                  autoFocus
                  onChange={handleArsToConvertChange}
                  value={arsToConvert}
                />
              </Grid>
              <Grid item xs={6} sm={6}>
                <Select className={classes.select} value={"ARS"} disabled>
                  <MenuItem value={"ARS"}>Pesos Argentinos</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={6} sm={6}>
                <TextField
                  type="number"
                  value={convertedAmount}
                  onChange={handleConvertedAmountChange}
                />
              </Grid>
              <Grid item xs={6} sm={6}>
                <Select
                  className={classes.select}
                  value={currencyToConvert ? currencyToConvert.code : ""}
                  onChange={handleCurrencyToConvertChange}
                >
                  {currencyList.map((currency: Currency) => (
                    <MenuItem key={currency.code} value={currency.code}>
                      {currency.name}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid item xs={12} sm={12}>
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
