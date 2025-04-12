import React, { useState } from "react";

import { t } from "i18next";
import withTitle from "utils/withTitle";

import NeetoHeader from "../commons/Header";
import QuizList from "../Quiz";

const Dashboard = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const handleSearch = () => {
    setSelectedRowKeys([]);
  };

  return (
    <div className="ml-16 flex w-full flex-1 flex-col overflow-hidden">
      <NeetoHeader onSearch={handleSearch} />
      <QuizList
        selectedRowKeys={selectedRowKeys}
        onSelectRowKeys={setSelectedRowKeys}
      />
    </div>
  );
};

export default withTitle(Dashboard, t("title.adminHome"));
