import React from "react";
import { Grid } from "@material-ui/core";

import {
  ArgumentAxis,
  ValueAxis,
  Chart,
  LineSeries,
  Legend,
  Tooltip,
  Title,
} from "@devexpress/dx-react-chart-material-ui";
import { Animation } from "@devexpress/dx-react-chart";
import { getEvolutionChartAtom } from "../../atom";
import { useAtom } from "jotai";

export default function EvolutionChart() {
  const [evolutionChart] = useAtom(getEvolutionChartAtom);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={12}>
        <Chart data={evolutionChart} height={370}>
          <LineSeries
            name="Dolar oficial"
            valueField="oficial"
            argumentField="year"
            color="green"
          />
          <LineSeries
            name="Dolar blue"
            valueField="blue"
            argumentField="year"
            color="blue"
          />
          <ArgumentAxis />
          <ValueAxis />
          <Animation />
          <Tooltip />
          <Legend position="bottom" />
          <Title text="Evolución anual" />
        </Chart>
      </Grid>
    </Grid>
  );
}
