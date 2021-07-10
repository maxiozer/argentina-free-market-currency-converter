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
import { BluelyticsResponse, Currencies, Currency } from "./types";
import meme from "./images/meme.jpg";
import {
  fetchBlueConvertionRate,
  fetchCurrencies,
  convertFromArs,
  convertToArs,
  createCurrencyList,
} from "./common";

import Header from "./components/Header";
import CurrencyValues from "./components/CurrencyValue";
import LastUpdate from "./components/LastUpdate";
import LoadingForm from "./components/LoadingForm";

export default function CalculadoraBlue() {
  const classes = useStyles();
  const isConvertingToArs = useRef(false);
  const [arsToConvert, setArsToConvert] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [currencyToConvert, setCurrencyToConvert] = useState<Currency>();
  const [currencyList, setCurrencyList] = useState<Currencies>([]);
  const [blueConvertionRate, setBlueConvertionRate] =
    useState<BluelyticsResponse>({});

  const componentMount = async () => {
    const blueConvertionRate = await fetchBlueConvertionRate();
    setBlueConvertionRate(blueConvertionRate);

    const fetchedCurrencies = await fetchCurrencies();

    const currencyList = createCurrencyList(fetchedCurrencies);
    setCurrencyList(currencyList);

    const defaultCurrencyToConvert: Currency | undefined = currencyList.find(
      (currency: Currency) => currency.code === "ILS"
    );
    setCurrencyToConvert(defaultCurrencyToConvert);
    setIsLoading(false);

    if (blueConvertionRate && blueConvertionRate.blue)
      setArsToConvert(blueConvertionRate.blue?.value_sell);
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

    setCurrencyToConvert(currencyToConvert);
  };

  const handleArsToConvertChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
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
                <img className={classes.img} src={meme} alt="meme"></img>
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
  img: {
    minWidth: "calc(100%)",
    maxWidth: "calc(100%)",
    borderRadius: "4px",
    opacity: 0.5,
  },
}));
