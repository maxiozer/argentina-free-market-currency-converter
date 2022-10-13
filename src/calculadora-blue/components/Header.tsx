import React from "react";
import { AppBar, Toolbar, Typography, Tabs, Tab } from "@material-ui/core";
import { TABS } from "../constants";
import { useAtom } from "jotai";
import { currentTabAtom } from "../../atom";

export default function Header() {
  const [currentTabId, setCurrentTabId] = useAtom(currentTabAtom);

  const onTabChange = (event: unknown, newValue: number) =>
    setCurrentTabId(newValue);

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
        value={currentTabId}
        onChange={onTabChange}
        variant="fullWidth"
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
