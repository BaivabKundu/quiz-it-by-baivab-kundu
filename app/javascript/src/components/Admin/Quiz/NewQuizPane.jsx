import React, { useState } from "react";

import { Pane, Typography, Button } from "@bigbinary/neetoui";
import { Input, Select, Form as NeetoUIForm } from "@bigbinary/neetoui/formik";
import { useFetchCategories } from "hooks/reactQuery/useCategoriesApi";
import { useFetchOrganization } from "hooks/reactQuery/useOrganizationsApi";
import { useCreateQuiz } from "hooks/reactQuery/useQuizzesApi";
import { isEmpty } from "ramda";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import routes from "routes";
import { getFromLocalStorage } from "utils/storage";
import { buildRoute } from "utils/url";

import { newQuizSchema } from "./constants";

const NewQuizPane = ({ isOpen, initialValues, onClose }) => {
  const [name, setName] = useState("");
  const [assignedCategory, setAssignedCategory] = useState(null);

  const history = useHistory();

  const { t } = useTranslation();

  const { data: { categories = [] } = {} } = useFetchCategories();
  const { data: { organization } = {} } = useFetchOrganization();

  const categoryOptions = isEmpty(categories)
    ? []
    : categories.map(category => ({
        label: category.name,
        value: category.name,
        id: category.id,
      }));

  const { mutate: createQuiz } = useCreateQuiz();

  const handleCreateNewQuiz = values => {
    const { name, assignedCategory } = values;
    const userId = getFromLocalStorage("authUserId");
    createQuiz(
      {
        name,
        category: assignedCategory.value,
        categoryId: assignedCategory.id,
        organizationId: organization?.id,
        creatorId: userId,
      },
      {
        onSuccess: response => {
          history.push(
            buildRoute(routes.admin.quizzes.questions, response.slug)
          );
          onClose();
        },
      }
    );
  };

  const handleClearFilters = () => {
    setName("");
    setAssignedCategory(null);
    onClose();
  };

  return (
    <Pane isOpen={isOpen} onClose={onClose}>
      <Pane.Header>
        <Typography className="text-2xl font-bold">
          {t("labels.addNewQuiz")}
        </Typography>
      </Pane.Header>
      <NeetoUIForm
        formikProps={{
          initialValues,
          validationSchema: newQuizSchema,
          onSubmit: handleCreateNewQuiz,
        }}
      >
        {({ setFieldValue, dirty }) => (
          <>
            <Pane.Body>
              <div className="w-full">
                <div className="space-y-2">
                  <Typography className="text-md font-bold">
                    {t("labels.name")}
                  </Typography>
                  <Input
                    name="name"
                    placeholder={t("inputPlaceholders.quizNameInput")}
                    value={name}
                    onChange={({ target: { value } }) => {
                      setName(value);
                      setFieldValue("name", value);
                    }}
                  />
                  <Typography className="text-md font-bold">
                    {t("labels.category")}
                  </Typography>
                  <Select
                    name="assignedCategory"
                    options={categoryOptions}
                    placeholder={t("inputPlaceholders.quizCategoryInput")}
                    value={assignedCategory}
                    onChange={value => {
                      setAssignedCategory(value || null);
                      setFieldValue("assignedCategory", value || null);
                    }}
                  />
                </div>
              </div>
            </Pane.Body>
            <Pane.Footer className="flex items-center space-x-2">
              <Button
                className="bg-blue-600 px-5 text-white"
                disabled={!dirty}
                label={t("labels.buttons.saveQuiz")}
                style="text"
                type="submit"
              />
              <Button
                className="px-5"
                disabled={!dirty}
                label={t("labels.buttons.cancelQuiz")}
                style="text"
                onClick={handleClearFilters}
              />
            </Pane.Footer>
          </>
        )}
      </NeetoUIForm>
    </Pane>
  );
};

export default NewQuizPane;
