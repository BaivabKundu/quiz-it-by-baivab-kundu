import React, { useEffect, useState } from "react";

import classnames from "classnames";
import { Login, Signup } from "components/Authentication";
import { either, isEmpty, isNil } from "ramda";
import { Route, Switch, useLocation } from "react-router-dom";
import { getFromLocalStorage } from "utils/storage";

import PublicDashboard from "./_Public/Dashboard";
import QuizAttempt from "./_Public/QuizAttempt";
import QuizResult from "./_Public/QuizResult";
import Register from "./_Public/Register";
import PrivateRoute from "./Admin/commons/PrivateRoute";
import QuizDashboard from "./Admin/Dashboard";
import QuizQuestions from "./Admin/Quiz/Questions";
import QuestionBuilder from "./Admin/Quiz/Questions/Builder";
import SubmissionList from "./Admin/Quiz/Submissions";
import GeneralSettings from "./Admin/Settings/General";
import Sidebar from "./Admin/Sidebar";
import PageNotFound from "./commons/PageNotFound";

import routes from "../routes";

const Main = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const authToken = getFromLocalStorage("authToken");
  const submssionId = sessionStorage.getItem("submissionId");
  const isLoggedIn = !either(isNil, isEmpty)(authToken);
  const isRegistered = !either(isNil, isEmpty)(submssionId);

  const handleSidepane = isSidepaneOpen => {
    setIsSidebarOpen(isSidepaneOpen || false);
  };

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname.includes("admin")]);

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {location.pathname.startsWith("/admin") &&
        !location.pathname.includes("login") &&
        !location.pathname.includes("signup") && (
          <Sidebar onSidebarOpen={handleSidepane} />
        )}
      {location.pathname.startsWith("/admin") &&
        !location.pathname.includes("login") &&
        !location.pathname.includes("signup") && (
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
        <Route
          exact
          component={PublicDashboard}
          path={routes.public.dashboard}
        />
        <Route
          exact
          component={Register}
          path={routes.public.quizzes.register}
        />
        <PrivateRoute
          exact
          condition={isRegistered}
          path={routes.public.quizzes.attempt}
          redirectRoute={routes.public.dashboard}
          render={() => <QuizAttempt />}
        />
        <Route
          exact
          component={QuizResult}
          path={routes.public.quizzes.result}
        />
        <Route exact component={Login} path={routes.admin.login} />
        <Route exact component={Signup} path={routes.admin.signup} />
        <PrivateRoute
          exact
          condition={isLoggedIn}
          path={routes.admin.dashboard}
          redirectRoute={routes.admin.login}
          render={() => <QuizDashboard />}
        />
        <PrivateRoute
          exact
          condition={isLoggedIn}
          path={routes.admin.quizzes.questions}
          redirectRoute={routes.admin.login}
          render={() => <QuizQuestions />}
        />
        <PrivateRoute
          exact
          condition={isLoggedIn}
          path={routes.admin.quizzes.question.new}
          redirectRoute={routes.admin.login}
          render={() => <QuestionBuilder />}
        />
        <PrivateRoute
          exact
          condition={isLoggedIn}
          path={routes.admin.quizzes.question.edit}
          redirectRoute={routes.admin.login}
          render={() => <QuestionBuilder />}
        />
        <PrivateRoute
          exact
          condition={isLoggedIn}
          path={routes.admin.quizzes.submissions}
          redirectRoute={routes.admin.login}
          render={() => <SubmissionList />}
        />
        <PrivateRoute
          exact
          condition={isLoggedIn}
          path={routes.admin.settings.base}
          redirectRoute={routes.admin.login}
          render={() => <GeneralSettings />}
        />
        <Route component={PageNotFound} path="*" />
      </Switch>
    </div>
  );
};

export default Main;
