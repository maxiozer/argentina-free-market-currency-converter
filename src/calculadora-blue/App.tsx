import {
  Box,
  CircularProgress,
  Container,
  CssBaseline,
  Divider,
  Toolbar,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { Suspense } from "react";

import Header from "./components/Header";

import { useAtom } from "jotai";
import PWAPrompt from "react-ios-pwa-prompt";
import { useSwipeable } from "react-swipeable";
import {
  changeCurrentTabAtom,
  getDolarBlueAtom,
  getDolarQatarAtom,
  getDolarTuristaAtom,
} from "./common/atom";
import CurrencyConverter from "./components/CurrencyConverter";
import EvolutionChart from "./components/EvolutionChart";
import TabPanel from "./components/TabPanel";

export default function App() {
  const classes = useStyles();
  const [dolarBlue] = useAtom(getDolarBlueAtom);
  const [dolarTurista] = useAtom(getDolarTuristaAtom);
  const [dolarQatar] = useAtom(getDolarQatarAtom);

  const [currentTabId, changeCurrentTab] = useAtom(changeCurrentTabAtom);

  const swipeConfig = useSwipeable({
    onSwipedLeft: () => changeCurrentTab(currentTabId + 1),
    onSwipedRight: () => changeCurrentTab(currentTabId - 1),
  });

  return (
    <Container component="main" maxWidth="sm" {...swipeConfig}>
      <Box className={classes.paper}>
        <CssBaseline />
        <Header />
        <Toolbar />
        <Toolbar />
        <PWAPrompt timesToShow={3} permanentlyHideOnDismiss={false} />
        <TabPanel value={currentTabId} index={0}>
          <CurrencyConverter {...dolarBlue} />
          <Box m={1} pt={1}>
            <Divider />
          </Box>
          <Suspense
            fallback={
              <Box className={classes.evolutionLoading}>
                <CircularProgress />
              </Box>
            }
          >
            <EvolutionChart />
          </Suspense>
        </TabPanel>
        <TabPanel value={currentTabId} index={1}>
          <CurrencyConverter {...dolarTurista} />
        </TabPanel>
        <TabPanel value={currentTabId} index={2}>
          <CurrencyConverter {...dolarQatar} />
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
    height: "100vh",
  },
  evolutionLoading: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 370,
  },
}));
