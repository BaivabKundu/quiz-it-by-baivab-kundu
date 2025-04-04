import React, { useState } from "react";

import { t } from "i18next";
import Header from "neetomolecules/Header";
import { Button } from "neetoui";
import { isEmpty } from "ramda";

import NewQuizPane from "../Quiz/NewQuizPane";

const NeetoHeader = (pageName = "") => {
  const [searchValue, setSearchValue] = useState("");
  const [isCreateNewQuizPaneOpen, setIsCreateNewQuizPaneOpen] = useState(false);

  return (
    <>
      <Header
        className="px-5"
        title={pageName === "" ? t("labels.header") : "All Submissions"}
        actionBlock={
          isEmpty(pageName) ? (
            <Button
              className="bg-blue-600"
              label={t("labels.buttons.addQuiz")}
              onClick={() => setIsCreateNewQuizPaneOpen(true)}
            />
          ) : null
        }
        searchProps={{
          onChange: event => {
            setSearchValue(event.target.value);
          },
          value: searchValue,
          placeholder:
            pageName === ""
              ? t("inputPlaceholders.searchInput")
              : "Search names",
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
