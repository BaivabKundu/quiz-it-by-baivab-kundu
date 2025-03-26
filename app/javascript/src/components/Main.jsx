import React from "react";

import { Login, Signup } from "components/Authentication";
import { Route, Switch } from "react-router-dom";

import Dashboard from "./Dashboard";

const Main = () => (
  <Switch>
    <Route exact component={Login} path="/login" />
    <Route exact component={Signup} path="/signup" />
    <Route exact component={Dashboard} path="/dashboard" />
  </Switch>
);

export default Main;
