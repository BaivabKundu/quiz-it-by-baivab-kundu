import React, { useEffect, useState } from "react";

import classnames from "classnames";
import { either, isEmpty, isNil } from "ramda";
import { Route, Switch, useLocation } from "react-router-dom";
import {
  getFromLocalStorage,
  getPublicUserFromLocalStorage,
} from "utils/storage";

import PrivateRoute from "./Admin/commons/PrivateRoute";
import Sidebar from "./Admin/Sidebar";
import PageNotFound from "./commons/PageNotFound";
import { getRouteConfig } from "./routeConfig";

const Main = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const authToken = getFromLocalStorage("authToken");
  const publicUserId = getPublicUserFromLocalStorage();
  const submissionId = sessionStorage.getItem("submissionId");
  const isLoggedIn = !either(isNil, isEmpty)(authToken);
  const isRegistered = !either(isNil, isEmpty)(publicUserId);
  const isSubmitted = !either(isNil, isEmpty)(submissionId);

  const handleSidepane = isSidepaneOpen => {
    setIsSidebarOpen(isSidepaneOpen || false);
  };

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname.includes("admin")]);

  const routeConfig = getRouteConfig(isLoggedIn, isRegistered, isSubmitted);

  const renderRoute = route => {
    if (route.private) {
      return (
        <PrivateRoute
          condition={route.condition}
          exact={route.exact}
          key={route.path}
          path={route.path}
          redirectRoute={route.redirect}
          render={() => <route.component />}
        />
      );
    }

    return (
      <Route
        component={route.component}
        exact={route.exact}
        key={route.path}
        path={route.path}
      />
    );
  };

  const isAdminRoute =
    location.pathname.startsWith("/admin") &&
    !location.pathname.includes("login") &&
    !location.pathname.includes("signup");

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {isAdminRoute && <Sidebar onSidebarOpen={handleSidepane} />}
      {isAdminRoute && (
        <div
          className={classnames(
            "overflow-auto transition-all duration-300 ease-in-out",
            {
              "ml-64": isSidebarOpen,
              "ml-0": !isSidebarOpen,
            }
          )}
        />
      )}
      <Switch>
        {[...routeConfig.public, ...routeConfig.admin].map(renderRoute)}
        <Route component={PageNotFound} path="*" />
      </Switch>
    </div>
  );
};

export default Main;
