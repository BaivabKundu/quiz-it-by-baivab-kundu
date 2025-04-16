import React from "react";

import { NoData } from "@bigbinary/neetoui";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import routes from "routes";
import withTitle from "utils/withTitle";

const PageNotFound = () => {
  const history = useHistory();

  const { t } = useTranslation();

  return (
    <div className="flex w-full items-center justify-center">
      <NoData
        title={t("messages.pageNotFound")}
        primaryButtonProps={{
          label: t("labels.buttons.home"),
          onClick: () => {
            localStorage.removeItem("publicUser");
            history.replace(routes.public.dashboard);
            window.location.reload();
          },
        }}
      />
    </div>
  );
};

export default withTitle(PageNotFound, t("title.pageNotFound"));
