import React from "react";

import { t } from "i18next";
import { Helmet } from "react-helmet";

const withTitle = (Component, title) => {
  const PageTitle = props => {
    const pageTitle = title ? t("title.page", { title }) : t("title.app");

    return (
      <>
        <Helmet>
          <title>{pageTitle}</title>
        </Helmet>
        <Component {...props} />
      </>
    );
  };

  return PageTitle;
};

export default withTitle;
