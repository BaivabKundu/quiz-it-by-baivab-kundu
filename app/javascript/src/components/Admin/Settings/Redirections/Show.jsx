import React, { useState } from "react";

import { Alert, Typography } from "@bigbinary/neetoui";
import { useDeleteRedirection } from "hooks/reactQuery/useRedirectionsApi";
import { MenuHorizontal } from "neetoicons";
import { Dropdown, Button } from "neetoui";
import { Trans, useTranslation } from "react-i18next";

const Show = ({ id, source, destination, onEdit }) => {
  const { t } = useTranslation();
  const [isDeleteActive, setIsDeleteActive] = useState(false);

  const { mutate: deleteRedirection } = useDeleteRedirection();

  const handleRedirectionDelete = () => {
    deleteRedirection(id);
  };

  return (
    <div className="grid grid-cols-5 items-center gap-4">
      <div className="col-span-2 overflow-hidden rounded border border-gray-200 bg-gray-50 p-3">
        <span className="block truncate">{source}</span>
      </div>
      <div className="col-span-2 overflow-hidden rounded border border-gray-200 bg-gray-50 p-3">
        <span className="block truncate">{destination}</span>
      </div>
      <div className="col-span-1 flex justify-around">
        <div className="h-8 w-8">
          <Dropdown
            buttonProps={{
              icon: MenuHorizontal,
              style: "text",
            }}
          >
            <div className="flex flex-col">
              <Button
                label={t("labels.buttons.edit")}
                style="text"
                onClick={onEdit}
              />
              <Button
                className="text-red-600"
                label={t("labels.buttons.delete")}
                style="text"
                onClick={() => setIsDeleteActive(true)}
              />
            </div>
          </Dropdown>
        </div>
      </div>
      {isDeleteActive && (
        <Alert
          isOpen={isDeleteActive}
          title={t("messages.alerts.deleteRedirection.title")}
          cancelButtonLabel={t(
            "messages.alerts.deleteRedirection.cancelButton"
          )}
          message={
            <Typography>
              <Trans
                i18nKey="messages.alerts.deleteRedirection.message"
                components={{
                  strong1: <strong />,
                  strong2: <strong />,
                }}
                values={{
                  source,
                  destination,
                }}
              />
            </Typography>
          }
          submitButtonLabel={t(
            "messages.alerts.deleteRedirection.confirmButton"
          )}
          onClose={() => setIsDeleteActive(false)}
          onSubmit={handleRedirectionDelete}
        />
      )}
    </div>
  );
};

export default Show;
