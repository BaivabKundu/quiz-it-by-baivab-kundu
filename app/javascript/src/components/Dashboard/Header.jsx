import React, { useState } from "react";

import { t } from "i18next";
import Header from "neetomolecules/Header";
import { Button } from "neetoui";

import NewQuizPane from "../Quiz/NewQuizPane";

const NeetoHeader = () => {
  const [searchValue, setSearchValue] = useState("");
  const [isCreateNewQuizPaneOpen, setIsCreateNewQuizPaneOpen] = useState(false);

  return (
    <>
      <Header
        className="px-5"
        title={t("labels.header")}
        actionBlock={
          <Button
            className="bg-blue-600"
            label={t("labels.buttons.addQuiz")}
            onClick={() => setIsCreateNewQuizPaneOpen(true)}
          />
        }
        searchProps={{
          onChange: event => {
            setSearchValue(event.target.value);
          },
          value: searchValue,
          placeholder: t("inputPlaceholders.searchInput"),
        }}
      />
      {isCreateNewQuizPaneOpen && (
        <NewQuizPane
          isOpen={isCreateNewQuizPaneOpen}
          initialValues={{
            name: "",
            assignedCategory: "",
          }}
          onClose={() => setIsCreateNewQuizPaneOpen(false)}
        />
      )}
    </>
  );
};

export default NeetoHeader;
