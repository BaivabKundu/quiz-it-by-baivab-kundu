import React from "react";

import { Login } from "components/Authentication";
import { Route, Switch } from "react-router-dom";

const Main = () => (
  <Switch>
    <Route exact component={Login} path="/login" />
  </Switch>
);

export default Main;
