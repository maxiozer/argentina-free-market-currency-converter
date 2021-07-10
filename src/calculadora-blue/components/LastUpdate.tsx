import { Typography } from "@material-ui/core";

export default function LastUpdate() {
  const updateDate = new Date();

  return (
    <Typography variant="subtitle1">
      Ultima actualizacion:{" "}
      {updateDate.toLocaleDateString("es-AR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })}
    </Typography>
  );
}
