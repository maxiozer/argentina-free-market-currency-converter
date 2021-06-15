import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import {
  Container,
  Typography,
  Box,
  Grid,
  MenuItem,
  Select,
  TextField,
  CssBaseline,
  AppBar,
  Toolbar,
  FormHelperText,
} from "@material-ui/core";
import { BluelyticsResponse, CurrenciesResponse, Currency } from "./types";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
}));

const requestBlueConvertionRate = (
  setBlueConvertionDate: React.Dispatch<
    React.SetStateAction<BluelyticsResponse>
  >
): void => {
  axios
    .get<BluelyticsResponse>("https://api.bluelytics.com.ar/v2/latest")
    .then((rta) => {
      setBlueConvertionDate(rta.data);
    });
};

const requestCurrencies = (setCurrencies: Function) => {
  const currenciesToShow = ["USD", "ILS", "EUR", "AUS"];
  axios
    .get("https://api.bluelytics.com.ar/data/json/currency.json")
    .then((rta) => {
      const currencies = rta.data.filter((currency: any) =>
        currenciesToShow.includes(currency.code)
      );
      setCurrencies(currencies);
    });
};

export default function Calculator() {
  const classes = useStyles();
  const [blueConvertionRate, setBlueConvertionRate] =
    useState<BluelyticsResponse>({});
  const [arsToConvert, setArsToConvert] = useState(0);
  const [currencyToConvert, setCurrencyToConvert] = useState<Currency>();
  const [currencyList, setCurrencyList] = useState<CurrenciesResponse>([]);
  const [convertedAmount, setConvertedAmount] = useState(0);

  useEffect(() => {
    requestBlueConvertionRate(setBlueConvertionRate);
    requestCurrencies((currencyList: any) => {
      setCurrencyList(currencyList);
      const currencyToConvertObj: Currency | undefined = currencyList.find(
        (currency: Currency) => currency.code === "ILS"
      );

      setCurrencyToConvert(currencyToConvertObj);
    });
  }, []);

  useEffect(() => {
    if (currencyToConvert && blueConvertionRate && blueConvertionRate.blue) {
      const convertedInUsd = arsToConvert / blueConvertionRate.blue?.value_sell;
      const convertedAmount = convertedInUsd * currencyToConvert.value;
      const convertedAmountInDecimals = Math.round(convertedAmount * 100) / 100;

      setConvertedAmount(convertedAmountInDecimals);
    }
  }, [currencyToConvert, arsToConvert, blueConvertionRate]);

  const changeCurrencyToConvert = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const currencyToConvertObj: Currency | undefined = currencyList.find(
      (currency) => currency.code === (event.target.value as string)
    );

    setCurrencyToConvert(currencyToConvertObj);
  };

  const changeArsToConvert = (event: React.ChangeEvent<{ value: unknown }>) => {
    setArsToConvert(event.target.value as number);
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6">Calculadora Blue</Typography>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <div className={classes.paper}>
        <Typography component="h1" variant="h6">
          Converti pesos a cualquier divisa usando la cotizacion paralela.
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={6}>
              <TextField
                autoComplete="ARS"
                variant="outlined"
                required
                fullWidth
                id="amountArs"
                autoFocus
                onChange={changeArsToConvert}
                value={arsToConvert}
              />
              <FormHelperText>
                1 USD BLUE = {blueConvertionRate.blue?.value_sell} ARS
              </FormHelperText>
            </Grid>
            <Grid item xs={6} sm={6}>
              <Select
                id="demo-simple-select"
                value={"ARS"}
                onChange={changeCurrencyToConvert}
                variant="outlined"
                disabled
              >
                <MenuItem value={"ARS"}>Pesos Argentinos (ARS)</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={6} sm={6}>
              <TextField
                type="number"
                variant="outlined"
                required
                fullWidth
                id="destination-amount"
                value={convertedAmount}
              />
            </Grid>
            <Grid item xs={6} sm={6}>
              <Select
                labelId="currency-label"
                id="demo-simple-select"
                value={currencyToConvert ? currencyToConvert.code : ""}
                onChange={changeCurrencyToConvert}
                variant="outlined"
              >
                {currencyList.map((currency: Currency) => (
                  <MenuItem key={currency.code} value={currency.code}>
                    {currency.name} ({currency.code})
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={5}></Box>
    </Container>
  );
}
