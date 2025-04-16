import React, { useState } from "react";

import { MenuHorizontal } from "@bigbinary/neeto-icons";
import { Radio, Dropdown, Alert, Typography } from "@bigbinary/neetoui";
import { Trans, useTranslation } from "react-i18next";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import routes from "routes";
import { buildRoute } from "utils/url";

const QuestionDisplayCard = ({ question, handleDelete, handleClone }) => {
  const { Menu, MenuItem, Divider } = Dropdown;
  const { Button: MenuButton } = MenuItem;

  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  const { slug } = useParams();

  const { t } = useTranslation();

  return (
    <div className="relative flex w-full rounded-md border border-gray-100 bg-white p-4 shadow-lg md:w-[600px] lg:w-[800px]">
      <Radio
        stacked
        label={question.body}
        labelProps={{ className: "text-lg mb-3" }}
      >
        {question.options.map(option => (
          <Radio.Item
            disabled
            checked={option.isCorrect}
            key={option.text}
            label={option.text}
            labelProps={{ className: "text-gray-400" }}
            name={`stackedOptions-${question.id}`}
            value={option.text}
          />
        ))}
      </Radio>
      <div className="absolute right-4 top-4">
        <Dropdown
          buttonStyle="text"
          icon={MenuHorizontal}
          position="bottom-end"
        >
          <Menu>
            <MenuItem>
              <MenuButton
                style="link"
                to={buildRoute(
                  routes.admin.quizzes.question.edit,
                  slug,
                  question.id
                )}
              >
                {t("labels.buttons.edit")}
              </MenuButton>
            </MenuItem>
            <Divider />
            <MenuItem>
              <MenuButton style="link" onClick={() => handleClone(question.id)}>
                {t("labels.buttons.clone")}
              </MenuButton>
            </MenuItem>
            <Divider />
            <MenuItem>
              <MenuButton
                style="danger"
                type="delete"
                onClick={() => setShowDeleteAlert(true)}
              >
                {t("labels.buttons.delete")}
              </MenuButton>
            </MenuItem>
          </Menu>
        </Dropdown>
      </div>
      {showDeleteAlert && (
        <Alert
          cancelButtonLabel={t("messages.alerts.deleteQuestion.cancelButton")}
          isOpen={showDeleteAlert}
          submitButtonLabel={t("messages.alerts.deleteQuestion.confirmButton")}
          title={t("messages.alerts.deleteQuestion.title")}
          message={
            <Typography>
              <Trans
                i18nKey="messages.alerts.deleteQuestion.message"
                components={{
                  strong: <strong />,
                }}
                values={{
                  questionName: question.body,
                }}
              />
            </Typography>
          }
          onClose={() => setShowDeleteAlert(false)}
          onSubmit={() => handleDelete(question.id, slug)}
        />
      )}
    </div>
  );
};

export default QuestionDisplayCard;
