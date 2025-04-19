import React, { useState } from "react";

import { Plus } from "@bigbinary/neeto-icons";
import { Button, Typography } from "@bigbinary/neetoui";
import { useFetchRedirections } from "hooks/reactQuery/useRedirectionsApi";
import { useTranslation } from "react-i18next";

import UrlCard from "./UrlCard";
import UrlForm from "./UrlForm";

import Navbar from "../Navbar";

const Redirections = () => {
  const [activeTab, setActiveTab] = useState("redirections");
  const [isCreatingRedirection, setIsCreatingRedirection] = useState(false);

  const { t } = useTranslation();

  const { data: { redirections = [] } = {} } = useFetchRedirections();

  return (
    <div className="ml-16 flex min-h-screen w-full flex-col bg-white">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="m-32">
        <div className="mb-16">
          <Typography className="text-4xl font-semibold">
            {t("labels.redirection.heading")}
          </Typography>
          <Typography className="text-md font-medium">
            {t("labels.redirection.subHeading")}
          </Typography>
        </div>
        <div className="mb-4 grid grid-cols-5 gap-4 font-medium">
          <div className="col-span-2">
            {t("labels.redirection.sourceHeading")}
          </div>
          <div className="col-span-2">
            {t("labels.redirection.destinationHeading")}
          </div>
          <div className="col-span-1" />
        </div>
        {redirections.map((redirection, index) => (
          <UrlCard key={index} redirectionData={redirection} />
        ))}
        {isCreatingRedirection && (
          <div>
            <UrlForm onClose={() => setIsCreatingRedirection(false)} />
          </div>
        )}
        <Button
          className="mb-12 mt-6 text-blue-500"
          disabled={isCreatingRedirection}
          icon={Plus}
          iconPosition="left"
          label={t("labels.redirection.addNewRedirection")}
          style="text"
          onClick={() => setIsCreatingRedirection(true)}
        />
      </div>
    </div>
  );
};

export default Redirections;
