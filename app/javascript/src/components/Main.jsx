import React from "react";

import { Login, Signup } from "components/Authentication";
import { Route, Switch } from "react-router-dom";

const Main = () => (
  <Switch>
    <Route exact component={Login} path="/login" />
    <Route exact component={Signup} path="/signup" />
  </Switch>
);

export default Main;
