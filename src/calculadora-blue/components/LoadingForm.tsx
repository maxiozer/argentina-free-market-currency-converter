import { Grid, CircularProgress } from "@material-ui/core";

export default function LoadingForm() {
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justify="center"
      style={{
        minHeight: "100vh",
      }}
    >
      <Grid item xs={3}>
        <CircularProgress />
      </Grid>
    </Grid>
  );
}
