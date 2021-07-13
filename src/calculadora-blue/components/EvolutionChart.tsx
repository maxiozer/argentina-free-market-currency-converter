import { EvolutionChartData } from "../types";
import Paper from "@material-ui/core/Paper";
import {
  ArgumentAxis,
  ValueAxis,
  Chart,
  LineSeries,
  Legend,
  Tooltip,
} from "@devexpress/dx-react-chart-material-ui";
import { Title } from "@devexpress/dx-react-chart-material-ui";
import {
  ValueScale,
  Animation,
  EventTracker,
} from "@devexpress/dx-react-chart";

export default function EvolutionChart(props: EvolutionProps) {
  return (
    <Paper>
      <Chart data={props.data}>
        <ValueScale name="Dolar oficial" />
        <ValueScale name="Dolar blue" />
        <LineSeries
          name="Dolar oficial"
          valueField="oficial"
          argumentField="year"
        />
        <LineSeries name="Dolar blue" valueField="blue" argumentField="year" />
        <ArgumentAxis />
        <ValueAxis />
        <Animation />
        <EventTracker />
        <Tooltip />
        <Legend position="bottom" />
        <Title text="Evolución anual" />
      </Chart>
    </Paper>
  );
}

interface EvolutionProps {
  data: EvolutionChartData[];
}
