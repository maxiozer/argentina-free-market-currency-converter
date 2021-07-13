import { Typography } from "@material-ui/core";
import React from "react";
import { BluelyticsResponse } from "../types";

export default function CurrencyValues(props: CurrencyValuesProps) {
  return (
    <React.Fragment>
      <Typography component="h1" variant="h6">
        USD Blue Compra: {props.blueConvertionRate.blue?.value_buy} ARS
      </Typography>
      <Typography component="h1" variant="h6">
        USD Blue Venta: {props.blueConvertionRate.blue?.value_sell} ARS
      </Typography>
    </React.Fragment>
  );
}

interface CurrencyValuesProps {
  blueConvertionRate: BluelyticsResponse;
}
