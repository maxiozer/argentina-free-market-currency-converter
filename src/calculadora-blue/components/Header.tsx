import React from "react";
import { AppBar, Toolbar, Typography, Tabs, Tab } from "@material-ui/core";
import { TABS } from "../constants";

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
        {TABS.map((value, index) => (
          <Tab key={index} label={value} {...a11yProps(index)} />
        ))}
      </Tabs>
    </AppBar>
  );
}

interface HeaderProps {
  tabId: number;
  onTabChange: any;
}
