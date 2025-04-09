import React, { useState } from "react";

import classnames from "classnames";
import { Login, Signup } from "components/Authentication";
import { Route, Switch } from "react-router-dom";

import PublicDashboard from "./_Public/Dashboard";
import QuizDashboard from "./Admin/Dashboard";
import QuizQuestions from "./Admin/Quiz/Questions";
import QuestionBuilder from "./Admin/Quiz/Questions/Builder";
import SubmissionList from "./Admin/Quiz/Submissions";
import GeneralSettings from "./Admin/Settings/General";
import Sidebar from "./Admin/Sidebar";

import routes from "../routes";

const Main = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSidepane = isSidepaneOpen => {
    setIsSidebarOpen(isSidepaneOpen || false);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {!window.location.pathname.includes("login") &&
        !window.location.pathname.includes("signup") &&
        !window.location.pathname.includes("public") && (
          <Sidebar onSidebarOpen={handleSidepane} />
        )}
      <div
        className={classnames(
          "overflow-auto transition-all duration-300 ease-in-out",
          {
            "ml-64": isSidebarOpen,
            "ml-0": !isSidebarOpen,
          }
        )}
      />
      <Switch>
        <Route
          exact
          component={PublicDashboard}
          path={routes.public.dashboard}
        />
        <Route exact component={Login} path={routes.admin.login} />
        <Route exact component={Signup} path={routes.admin.signup} />
        <Route exact component={QuizDashboard} path={routes.admin.dashboard} />
        <Route
          exact
          component={QuizQuestions}
          path={routes.admin.quizzes.questions}
        />
        <Route
          exact
          component={QuestionBuilder}
          path={routes.admin.quizzes.question.new}
        />
        <Route
          exact
          component={QuestionBuilder}
          path={routes.admin.quizzes.question.edit}
        />
        <Route
          exact
          component={SubmissionList}
          path={routes.admin.quizzes.submissions}
        />
        <Route
          exact
          component={GeneralSettings}
          path={routes.admin.settings.base}
        />
      </Switch>
    </div>
  );
};

export default Main;
