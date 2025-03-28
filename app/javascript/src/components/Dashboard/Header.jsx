import React from "react";

import { t } from "i18next";
import { Search } from "neetoicons";
import Header from "neetomolecules/Header";
import { Button, Input } from "neetoui";

const NeetoHeader = () => (
  <Header
    className="px-5"
    title={t("labels.header")}
    actionBlock={
      <>
        <Input
          placeholder={t("inputPlaceholders.searchInput")}
          prefix={<Search />}
          type="search"
        />
        <Button className="bg-blue-600" label={t("labels.addQuizButton")} />
      </>
    }
  />
);

export default NeetoHeader;
