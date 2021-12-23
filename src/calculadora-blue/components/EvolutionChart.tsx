import React from "react";
import { EvolutionChartData } from "../types";
import Paper from "@material-ui/core/Paper";
import { LinearProgress } from "@material-ui/core";

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

export default function EvolutionChart(props: EvolutionProps) {
  return (
    <Paper>
      <Chart data={props.data}>
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
        {props.isLoading && <LinearProgress color="secondary" />}
      </Chart>
    </Paper>
  );
}

interface EvolutionProps {
  data: EvolutionChartData[];
  isLoading: boolean;
}
