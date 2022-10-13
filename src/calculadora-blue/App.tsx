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
import {
  changeCurrentTabAtom,
  getDolarBlueAtom,
  getDolarTuristaAtom
} from "../atom";
import EvolutionChart from "./components/EvolutionChart";
import { useSwipeable } from "react-swipeable";

export default function App() {
  const classes = useStyles();
  const [blueConvertionRate] = useAtom(getDolarBlueAtom);
  const [turistaConvertionRate] = useAtom(getDolarTuristaAtom);

  const [currentTabId, changeCurrentTab] = useAtom(changeCurrentTabAtom);

  const swipeConfig = useSwipeable({
    onSwipedLeft: () => changeCurrentTab(currentTabId + 1),
    onSwipedRight: () => changeCurrentTab(currentTabId - 1),
  });

  return (
    <Container component="main" maxWidth="xs" {...swipeConfig}>
      <Box
        height="100vh"
        display="flex"
        flexDirection="column"
        className={classes.paper}
      >
        <CssBaseline />
        <Header />
        <Toolbar />
        <Toolbar />
        <PWAPrompt timesToShow={3} permanentlyHideOnDismiss={false} />
        <TabPanel value={currentTabId} index={0}>
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
        <TabPanel value={currentTabId} index={1}>
          <Calculadora
            buyPrice={turistaConvertionRate.compra}
            sellPrice={turistaConvertionRate.venta}
            lastUpdate={new Date(turistaConvertionRate.fecha)}
          />
        </TabPanel>
        <TabPanel value={currentTabId} index={2}>
          <Calculadora
            buyPrice={turistaConvertionRate.compra}
            sellPrice={turistaConvertionRate.venta * 1.25}
            lastUpdate={new Date(turistaConvertionRate.fecha)}
          />
        </TabPanel>
      </Box>
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
