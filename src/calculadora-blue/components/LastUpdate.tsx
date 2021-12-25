import React from "react";
import { Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

const GrayTextTypography = withStyles({
  root: {
    color: "gray",
  },
})(Typography);

export default function LastUpdate() {
  const updateDate = new Date();

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
