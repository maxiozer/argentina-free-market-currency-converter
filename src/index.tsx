import React from "react";
import ReactDOM from "react-dom";
import firebase from "firebase/app";
import "firebase/analytics";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";
import { createMuiTheme, ThemeProvider } from "@material-ui/core";
import CalculadoraBlue from "./calculadora-blue/CalculadoraBlue";

const appThemeOptions = {
  props: {
    MuiTextField: {
      variant: "outlined" as "outlined",
    },
    MuiSelect: {
      variant: "outlined" as "outlined",
    },
  },
};
const appTheme = createMuiTheme(appThemeOptions);

const firebaseConfig = {
  apiKey: "AIzaSyAcmJv53ElrP8h53lfpErTgw4xSa-kZnwo",
  authDomain: "free-market-currency-converter.firebaseapp.com",
  projectId: "free-market-currency-converter",
  storageBucket: "free-market-currency-converter.appspot.com",
  messagingSenderId: "942367574551",
  appId: "1:942367574551:web:5101a4401734d1e2916a52",
  measurementId: "G-XWG7N57CET",
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={appTheme}>
      <CalculadoraBlue />
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
