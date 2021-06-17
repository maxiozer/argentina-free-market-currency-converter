import React, { useState, useEffect, useRef } from "react";
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
import meme from "./meme.jpg";
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

const convertFromArs = (
  arsToConvert: number,
  usdBlueValue: number,
  currencyToConvertValue: number
): number => {
  const convertedInUsd = arsToConvert / usdBlueValue;
  const convertedAmount = convertedInUsd * currencyToConvertValue;
  return Math.round(convertedAmount * 100) / 100;
};

const convertToArs = (
  valueToConvert: number,
  usdBlueValue: number,
  currencyToConvertValue: number
): number => {
  const convertedInUsd = valueToConvert / currencyToConvertValue;
  const convertedAmount = convertedInUsd * usdBlueValue;
  return Math.round(convertedAmount * 100) / 100;
};

export default function App() {
  const classes = useStyles();
  const convertingToArs = useRef(false);
  const [arsToConvert, setArsToConvert] = useState(1);
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [currencyToConvert, setCurrencyToConvert] = useState<Currency>();
  const [currencyList, setCurrencyList] = useState<CurrenciesResponse>([]);
  const [blueConvertionRate, setBlueConvertionRate] =
    useState<BluelyticsResponse>({});

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
    if (convertingToArs.current) {
      convertingToArs.current = false;
    } else if (
      currencyToConvert &&
      blueConvertionRate &&
      blueConvertionRate.blue
    ) {
      const convertedAmount = convertFromArs(
        arsToConvert,
        blueConvertionRate.blue.value_sell,
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

    if (currencyToConvert && blueConvertionRate && blueConvertionRate.blue) {
      const ars = convertToArs(
        convertedAmount,
        blueConvertionRate.blue.value_sell,
        currencyToConvert.value
      );

      convertingToArs.current = true;
      setArsToConvert(ars);
    }

    setConvertedAmount(convertedAmount);
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
          USD Compra: {blueConvertionRate.blue?.value_buy} ARS
        </Typography>
        <Typography component="h1" variant="h6">
          USD Venta: {blueConvertionRate.blue?.value_sell} ARS
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={6}>
              <TextField
                type="number"
                autoComplete="ARS"
                variant="outlined"
                fullWidth
                autoFocus
                onChange={handleArsToConvertChange}
                value={arsToConvert}
              />
            </Grid>
            <Grid item xs={6} sm={6}>
              <Select
                id="demo-simple-select"
                className={classes.select}
                value={"ARS"}
                onChange={handleCurrencyToConvertChange}
                variant="outlined"
                disabled
              >
                <MenuItem value={"ARS"}>Pesos Argentinos</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={6} sm={6}>
              <TextField
                type="number"
                variant="outlined"
                required
                id="destination-amount"
                value={convertedAmount}
                onChange={handleConvertedAmountChange}
              />
            </Grid>
            <Grid item xs={6} sm={6}>
              <Select
                className={classes.select}
                labelId="currency-label"
                value={currencyToConvert ? currencyToConvert.code : ""}
                onChange={handleCurrencyToConvertChange}
                variant="outlined"
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
        </form>
      </div>
      <Box mt={5}></Box>
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
  form: {
    width: "100%",
    marginTop: theme.spacing(3),
  },
  select: {
    minWidth: "calc(100%)",
    maxWidth: "calc(100%)",
  },
  img: {
    minWidth: "calc(100%)",
    maxWidth: "calc(100%)",
    borderRadius: "4px",
  },
}));
