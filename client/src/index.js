import React from "react";
import ReactDOM from "react-dom/client";

import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { Provider } from "react-redux";

import "bootstrap/dist/css/bootstrap.min.css";
/* import "./assets/css/animate.min.css"; */
/* import "./assets/scss/light-bootstrap-dashboard-react.scss?v=2.0.0"; */
import "./assets/scss/style.scss?v=2.0.0";
import "./assets/css/style.css";
import "./assets/css/responsive.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import store from "./store";
import { getSettings } from "./Redux/settingsReduce";
import LoginPage from "./views/Settings/User/LoginPage";
import ResetPassword from "./views/Settings/User/ResetPassword";
import jwt_decode from "jwt-decode";
import { getDetailUser } from "./Redux/usersReduce";
import RootBase from "./RootBase";
/* import jwt from "jsonwebtoken"; */

const root = ReactDOM.createRoot(document.getElementById("root"));
var token = null;
var hrefURL = null;
token = localStorage.getItem("x-access-token");
var testLogin = 0;
try {
  store.dispatch(getSettings(1));
} catch (error) {
  console.log("settings", error);
}
if (token !== null) {
  try {
    var decoded = jwt_decode(token);
    testLogin = 1;
    if (decoded.id) store.dispatch(getDetailUser(decoded.id));
    else {
      localStorage.clear();
      window.location.replace("/login");
    }
  } catch (err) {
    console.log("eee", err);
  }
}
if (hrefURL === "/login") {
  document.title = "login";
}
root.render(
  <Provider store={store}>
    <BrowserRouter>
      {testLogin === 0 ? (
        <Switch>
          <Route path="/login" render={() => <LoginPage />} key={"1"} />
          <Route path="/resetPassword/:code" render={() => <ResetPassword />} />
          <Redirect from="/" to="/login" />
        </Switch>
      ) : (
        <RootBase />
      )}
    </BrowserRouter>
  </Provider>
);



