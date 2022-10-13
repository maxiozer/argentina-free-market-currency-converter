import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Container, CssBaseline, Toolbar } from "@material-ui/core";
import { EvolutionChartData } from "./types";
import { fetchEvolution, generateEvolutionChartData } from "./common";

import Header from "./components/Header";

import PWAPrompt from "react-ios-pwa-prompt";
import Calculadora from "./Calculadora";
import TabPanel from "./components/TabPanel";
import { useAtom } from "jotai";
import { getDolarBlueAtom, getDolarTuristaAtom } from "../atom";

export default function App() {
  const classes = useStyles();
  const [isLoadingEvolutionChart, setIsLoadingEvolutionChart] = useState(true);

  const [evolutionChart, setEvolutionChart] = useState<EvolutionChartData[]>(
    []
  );

  const [blueConvertionRate] = useAtom(getDolarBlueAtom);
  const [turistaConvertionRate] = useAtom(getDolarTuristaAtom);

  useEffect(() => {
    fetchEvolution().then((evolution) => {
      const evolutionChart = generateEvolutionChartData(evolution);
      setEvolutionChart(evolutionChart);
      setIsLoadingEvolutionChart(false);
    });
  }, []);

  const [tabId, setTabId] = useState(0);
  const onTabChange = (event: unknown, newValue: number) => setTabId(newValue);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Header tabId={tabId} onTabChange={onTabChange}></Header>
      <Toolbar />
      <Toolbar />
      <div className={classes.paper}>
        <PWAPrompt timesToShow={3} permanentlyHideOnDismiss={false} />
        <TabPanel value={tabId} index={0}>
          <Calculadora
            buyPrice={blueConvertionRate.compra}
            sellPrice={blueConvertionRate.venta}
            lastUpdate={new Date(blueConvertionRate.fecha)}
            isLoadingEvolutionChart={isLoadingEvolutionChart}
            evolutionChart={evolutionChart}
          />
        </TabPanel>
        <TabPanel value={tabId} index={1}>
          <Calculadora
            buyPrice={turistaConvertionRate.compra}
            sellPrice={turistaConvertionRate.venta}
            lastUpdate={new Date(turistaConvertionRate.fecha)}
            isLoadingEvolutionChart={isLoadingEvolutionChart}
            evolutionChart={evolutionChart}
          />
        </TabPanel>
      </div>
    </Container>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
}));
