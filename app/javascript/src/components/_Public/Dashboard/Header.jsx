import React from "react";

import { Button } from "@bigbinary/neetoui";
import Header from "neetomolecules/Header";
import { Trans, useTranslation } from "react-i18next";
import routes from "routes";

const DashboardHeader = ({ organizationName }) => {
  const { t } = useTranslation();

  return (
    <Header
      className="px-5"
      actionBlock={
        <Button
          className="bg-blue-600"
          label={t("labels.buttons.loginAsAdmin")}
          to={routes.admin.login}
        />
      }
      title={
        <Trans
          components={{ strong: <strong /> }}
          i18nKey="labels.organizationName"
          values={{ name: organizationName }}
        />
      }
    />
  );
};

export default DashboardHeader;
