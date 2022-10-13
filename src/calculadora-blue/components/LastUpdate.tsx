import React from "react";
import { Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

const GrayTextTypography = withStyles({
  root: {
    color: "gray",
  },
})(Typography);

interface LastUpdateInterface{
  updateDate: Date;
}
export default function LastUpdate({updateDate}:LastUpdateInterface) {

  return (
    <GrayTextTypography align="center" variant="subtitle2">
      Ultima actualizacion:{" "}
      {updateDate.toLocaleDateString("es-AR", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })}
    </GrayTextTypography>
  );
}
