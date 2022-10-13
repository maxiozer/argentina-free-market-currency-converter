import React, { useState, useEffect, useRef, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, TextField, Divider } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Currency } from "./types";
import { convertFromArs, convertToArs } from "./common";

import CurrencyValues from "./components/CurrencyValue";
import LastUpdate from "./components/LastUpdate";
import EvolutionChart from "./components/EvolutionChart";

import firebase from "firebase/app";

import { useAtom } from "jotai";
import {
  getCurrencyListAtom,
  currencyToConvertAtom,
  getLocationCurrencyAtom,
} from "../atom";
import { DEFAULT_CURRENCY_LIST_ITEM } from "./constants";

interface CalculadoraProps {
  buyPrice: number;
  sellPrice: number;
  lastUpdate: Date;
}

export default function Calculadora({
  sellPrice,
  buyPrice,
  lastUpdate,
}: CalculadoraProps) {
  const classes = useStyles();
  const [convertedAmount, setConvertedAmount] = useState(0);
  const isConvertingToArs = useRef(false);
  const [arsToConvert, setArsToConvert] = useState(1);

  const [currencyToConvert, setCurrencyToConvert] = useAtom(
    currencyToConvertAtom
  );
  const [currencyList] = useAtom(getCurrencyListAtom);
  const [locationCurrency] = useAtom(getLocationCurrencyAtom);

  useEffect(() => {
    if (sellPrice) setArsToConvert(sellPrice);
  }, [sellPrice]);

  useEffect(() => {
    if (isConvertingToArs.current) {
      isConvertingToArs.current = false;
    } else if (currencyToConvert && sellPrice) {
      const convertedAmount = convertFromArs(
        arsToConvert,
        buyPrice || sellPrice,
        currencyToConvert.value
      );
      setConvertedAmount(convertedAmount);
    }
  }, [currencyToConvert, arsToConvert, buyPrice, sellPrice]);

  useEffect(() => {
    if (currencyToConvert === DEFAULT_CURRENCY_LIST_ITEM) {
      const defaultCurrencyToConvert: Currency | undefined = currencyList.find(
        (currency: Currency) => currency.code === locationCurrency
      );
      setCurrencyToConvert(defaultCurrencyToConvert);
    }
  }, [currencyList, locationCurrency]);

  const onConvertedAmountChange = useCallback(
    (event: React.ChangeEvent<{ value: unknown }>) => {
      const convertedAmount = event.target.value as number;

      if (currencyToConvert && sellPrice) {
        const ars = convertToArs(
          convertedAmount,
          sellPrice,
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
    [sellPrice, currencyToConvert]
  );

  const onCurrencyToConvertChange = useCallback(
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

  return (
    <Grid container spacing={2}>
      <Grid container item spacing={1}>
        <Grid item xs={12} sm={12}>
          <CurrencyValues buyPrice={buyPrice} sellPrice={sellPrice} />
          <LastUpdate updateDate={lastUpdate} />
        </Grid>
      </Grid>
      <Grid container item spacing={1}>
        <Grid item xs={5} sm={6}>
          <TextField
            type="number"
            value={convertedAmount}
            onChange={onConvertedAmountChange}
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
            getOptionSelected={(option, value) => option.code === value.code}
            onChange={onCurrencyToConvertChange}
            className={classes.select}
            renderInput={(params) => <TextField {...params} />}
          />
        </Grid>
        <Grid item xs={5} sm={6}>
          <TextField
            type="number"
            onChange={handleArsToConvertChange}
            value={arsToConvert}
          />
        </Grid>
        <Grid item xs={7} sm={6}>
          <TextField type="text" value="Pesos Argentinos" disabled={true} />
        </Grid>
      </Grid>
    </Grid>
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
