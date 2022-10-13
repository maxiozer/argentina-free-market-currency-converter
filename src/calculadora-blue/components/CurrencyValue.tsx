import { Typography } from "@material-ui/core";
import React from "react";

export default function CurrencyValues(props: CurrencyValuesProps) {
  return (
    <React.Fragment>
      <Typography align="center" component="h1" variant="h6">
        Compra <b>{props.buyPrice ? `${props.buyPrice} ARS`: "No cotiza"}</b>
      </Typography>
      <Typography align="center" component="h1" variant="h6">
        Venta <b>{props.sellPrice} ARS</b>
      </Typography>
    </React.Fragment>
  );
}

interface CurrencyValuesProps {
  buyPrice?: number;
  sellPrice: number;
}
