import { Typography } from "@material-ui/core";
import React from "react";
import { BluelyticsResponse } from "../types";

export default function CurrencyValues(props: CurrencyValuesProps) {
  return (
    <React.Fragment>
      <Typography component="h1" variant="h6">
        USD Blue Compra: <b>{props.blueConvertionRate.blue?.value_buy} ARS</b>
      </Typography>
      <Typography component="h1" variant="h6">
        USD Blue Venta: <b>{props.blueConvertionRate.blue?.value_sell} ARS</b>
      </Typography>
    </React.Fragment>
  );
}

interface CurrencyValuesProps {
  blueConvertionRate: BluelyticsResponse;
}
