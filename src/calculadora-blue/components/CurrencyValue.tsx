import { Typography } from "@material-ui/core";
import React from "react";
import { BluelyticsResponse } from "../types";

export default function CurrencyValues(props: CurrencyValuesProps) {
  return (
    <React.Fragment>
      <Typography align="center" component="h1" variant="h6">
        Compra <b>{props.blueConvertionRate.blue?.value_buy} ARS</b>
      </Typography>
      <Typography align="center" component="h1" variant="h6">
        Venta <b>{props.blueConvertionRate.blue?.value_sell} ARS</b>
      </Typography>
    </React.Fragment>
  );
}

interface CurrencyValuesProps {
  blueConvertionRate: BluelyticsResponse;
}
