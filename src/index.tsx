/// <reference path="declarations.d.ts"/>
import React from "react";
import ReactDOM from "react-dom";
import firebase from "firebase/app";
import "firebase/analytics";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";
import { ThemeProvider } from "@material-ui/core";
import App from "./calculadora-blue/App";
import { createTheme } from "@material-ui/core/styles";
import { hotjar } from 'react-hotjar';
import { firebaseConfig, appThemeOptions, HOTJAR_ID } from "./constants";

const appTheme = createTheme(appThemeOptions);

firebase.initializeApp(firebaseConfig);
firebase.analytics();

hotjar.initialize(HOTJAR_ID, 6);

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={appTheme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
