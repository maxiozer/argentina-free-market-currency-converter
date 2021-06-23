import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
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
  LinearProgress,
  CircularProgress,
} from "@material-ui/core";
import { BluelyticsResponse, Currencies, Currency } from "./types";
import meme from "./meme.jpg";
import {
  fetchBlueConvertionRate,
  fetchCurrencies,
  convertFromArs,
  convertToArs,
  createCurrencyList,
} from "./common";

export default function App() {
  const classes = useStyles();
  const convertingToArs = useRef(false);
  const [arsToConvert, setArsToConvert] = useState(1);
  const [loading, setLoading] = useState(true);
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [currencyToConvert, setCurrencyToConvert] = useState<Currency>();
  const [currencyList, setCurrencyList] = useState<Currencies>([]);
  const [blueConvertionRate, setBlueConvertionRate] =
    useState<BluelyticsResponse>({});

  useEffect(() => {
    const initApp = async () => {
      const blueConvertionRate = await fetchBlueConvertionRate();
      setBlueConvertionRate(blueConvertionRate);

      const fetchedCurrencies = await fetchCurrencies();

      const currencyList = createCurrencyList(fetchedCurrencies);
      setCurrencyList(currencyList);

      const defaultCurrencyToConvert: Currency | undefined = currencyList.find(
        (currency: Currency) => currency.code === "ILS"
      );
      setCurrencyToConvert(defaultCurrencyToConvert);
      setLoading(false);

      if (blueConvertionRate && blueConvertionRate.blue)
        setArsToConvert(blueConvertionRate.blue?.value_sell);
    };

    initApp();
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

  const updateDate = new Date();

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6">Calculadora Blue</Typography>
        </Toolbar>
        {loading && <LinearProgress />}
      </AppBar>
      <Toolbar />
      {loading && (
        <div className={classes.paper}>
          <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justify="center"
            style={{ minHeight: "100vh" }}
          >
            <Grid item xs={3}>
              <CircularProgress />
            </Grid>
          </Grid>
        </div>
      )}
      {!loading && (
        <div className={classes.paper}>
          <Typography component="h1" variant="h6">
            USD Compra: {blueConvertionRate.blue?.value_buy} ARS
          </Typography>
          <Typography component="h1" variant="h6">
            USD Venta: {blueConvertionRate.blue?.value_sell} ARS
          </Typography>
          <Typography variant="subtitle1">
            Ultima actualizacion:{" "}
            {!loading &&
              updateDate.toLocaleDateString("es-AR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })}
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
      )}
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
    opacity: 0.5,
  },
}));
