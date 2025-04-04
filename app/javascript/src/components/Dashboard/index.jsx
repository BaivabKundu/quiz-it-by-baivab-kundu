import React from "react";

import NeetoHeader from "../commons/Header";
import QuizList from "../Quiz";

const Dashboard = () => (
  <div className="ml-16 flex w-full flex-1 flex-col overflow-hidden">
    <NeetoHeader />
    <QuizList />
  </div>
);

export default Dashboard;
