import React, { useState } from "react";

import Settings from "@bigbinary/neeto-molecules/Settings";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";

import { configurationItems } from "./items";

import Navbar from "../Navbar";

const ConfigureQuiz = () => {
  const [activeTab, setActiveTab] = useState("configuration");

  const { slug } = useParams();

  return (
    <div className="ml-16 flex w-full flex-1 flex-col overflow-hidden">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="mx-auto w-2/3 px-4 py-8">
        <Settings
          isSearchHidden
          className=""
          title="Quiz settings"
          categories={[
            {
              id: "quiz-settings",
              items: configurationItems(slug),
            },
          ]}
        />
      </div>
    </div>
  );
};

export default ConfigureQuiz;
