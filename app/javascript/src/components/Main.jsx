import React, { useState } from "react";

import classnames from "classnames";
import { Login, Signup } from "components/Authentication";
import { Route, Switch } from "react-router-dom";

import Dashboard from "./Dashboard";
import QuizQuestions from "./Quiz/QuizQuestions";
import QuestionBuilder from "./Quiz/QuizQuestions/QuestionBuilder";
import SubmissionList from "./Quiz/Submissions";
import Sidebar from "./Sidebar";

import routes from "../routes";

const Main = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSidepane = isSidepaneOpen => {
    setIsSidebarOpen(isSidepaneOpen || false);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {!["/login", "/signup"].includes(window.location.pathname) && (
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
        <Route exact component={Login} path={routes.login} />
        <Route exact component={Signup} path={routes.signup} />
        <Route exact component={Dashboard} path={routes.dashboard} />
        <Route
          exact
          component={QuizQuestions}
          path={routes.quizzes.questions.root}
        />
        <Route
          exact
          component={QuestionBuilder}
          path={routes.quizzes.questions.build}
        />
        <Route
          exact
          component={QuestionBuilder}
          path={routes.quizzes.questions.edit}
        />
        <Route
          exact
          component={SubmissionList}
          path={routes.quizzes.submissions}
        />
      </Switch>
    </div>
  );
};

export default Main;
