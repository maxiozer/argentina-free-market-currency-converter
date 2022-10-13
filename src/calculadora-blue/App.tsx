import React, { useState, Suspense } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Box,
  CircularProgress,
  Container,
  CssBaseline,
  Divider,
  Toolbar,
} from "@material-ui/core";

import Header from "./components/Header";

import PWAPrompt from "react-ios-pwa-prompt";
import Calculadora from "./Calculadora";
import TabPanel from "./components/TabPanel";
import { useAtom } from "jotai";
import { getDolarBlueAtom, getDolarTuristaAtom } from "../atom";
import EvolutionChart from "./components/EvolutionChart";

export default function App() {
  const classes = useStyles();
  const [blueConvertionRate] = useAtom(getDolarBlueAtom);
  const [turistaConvertionRate] = useAtom(getDolarTuristaAtom);

  const [tabId, setTabId] = useState(0);
  const onTabChange = (event: unknown, newValue: number) => setTabId(newValue);

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <CssBaseline />
        <Header tabId={tabId} onTabChange={onTabChange} />
        <Toolbar />
        <Toolbar />
        <PWAPrompt timesToShow={3} permanentlyHideOnDismiss={false} />
        <TabPanel value={tabId} index={0}>
          <Calculadora
            buyPrice={blueConvertionRate.compra}
            sellPrice={blueConvertionRate.venta}
            lastUpdate={new Date(blueConvertionRate.fecha)}
          />
          <Box m={1} pt={1}>
            <Divider variant="middle" />
          </Box>
          <Suspense
            fallback={
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height={370}
              >
                <CircularProgress />
              </Box>
            }
          >
            <EvolutionChart />
          </Suspense>
        </TabPanel>
        <TabPanel value={tabId} index={1}>
          <Calculadora
            buyPrice={turistaConvertionRate.compra}
            sellPrice={turistaConvertionRate.venta}
            lastUpdate={new Date(turistaConvertionRate.fecha)}
          />
        </TabPanel>
        <TabPanel value={tabId} index={2}>
          <Calculadora
            buyPrice={turistaConvertionRate.compra}
            sellPrice={turistaConvertionRate.venta * 1.25}
            lastUpdate={new Date(turistaConvertionRate.fecha)}
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
