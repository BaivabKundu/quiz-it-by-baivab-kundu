import React from "react";

import ErrorPage from "@bigbinary/neeto-molecules/ErrorPage";
import routes from "routes";

const ErrorPageLayout = ({ status }) => (
  <div className="w-full">
    <ErrorPage homeUrl={routes.public.dashboard} status={status} />
  </div>
);

export default ErrorPageLayout;
