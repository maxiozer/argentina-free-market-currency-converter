import { AppBar, Tab, Tabs, Toolbar, Typography } from "@material-ui/core";
import { useAtom } from "jotai";
import React from "react";
import { changeCurrentTabAtom } from "../common/atom";
import { TABS } from "../common/constants";
import ShareIcon from "@material-ui/icons/Share";
import { canShareUrl, shareUrl } from "../common/functions";
import { createStyles, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    title: {
      flexGrow: 1,
    },
  }),
);

export default function Header() {
  const classes = useStyles();
  const [currentTabId, setCurrentTabId] = useAtom(changeCurrentTabAtom);

  const onTabChange = (event: unknown, newValue: number) =>
    setCurrentTabId(newValue);

  function a11yProps(index: any) {
    return {
      id: `action-tab-${index}`,
      "aria-controls": `action-tabpanel-${index}`,
    };
  }

  return (
    <AppBar position="fixed" className={classes.root}>
      <Toolbar>
        <Typography variant="h6" className={classes.title}>Conversor Dólar Blue</Typography>
        {canShareUrl() && <ShareIcon onClick={shareUrl}/>}
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
