import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Tabs,
  Tab,
} from "@material-ui/core";

export default function Header(props: HeaderProps) {
  function a11yProps(index: any) {
    return {
      id: `action-tab-${index}`,
      "aria-controls": `action-tabpanel-${index}`,
    };
  }

  return (
    <AppBar position="fixed">
      <Toolbar>
        <Typography variant="h6">Conversor de divisas en Dólar Blue</Typography>
      </Toolbar>
      <Tabs
        value={props.tabId}
        onChange={props.onTabChange}
        variant="fullWidth"
        // indicatorColor="secondary"
        // textColor="primary"
        aria-label="Dolar"
        centered
      >
        <Tab label="Dolar blue" {...a11yProps(0)} />
        <Tab label="Dolar Turista" {...a11yProps(1)} />
      </Tabs>
    </AppBar>
  );
}

interface HeaderProps {
  tabId: number;
  onTabChange: any;
}
