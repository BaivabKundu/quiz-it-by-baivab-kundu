import { filterSchema } from "constants/validations";

import React, { useState } from "react";

import { Pane, Typography, Button } from "@bigbinary/neetoui";
import { Input, Select, Form as NeetoUIForm } from "@bigbinary/neetoui/formik";
import { useFetchCategories } from "hooks/reactQuery/useCategoriesApi";
import { isEmpty } from "ramda";
import { useTranslation } from "react-i18next";

const FilterPane = ({
  isOpen,
  initialValues,
  onClose,
  onApplyFilters,
  currentFilters = {},
}) => {
  const [name, setName] = useState(currentFilters.name || "");
  const [selectedCategories, setSelectedCategories] = useState(
    currentFilters.selectedCategories
      ? currentFilters.selectedCategories.map(category => ({
          label: category,
          value: category,
        }))
      : []
  );

  const [status, setStatus] = useState(
    currentFilters.status
      ? {
          label: currentFilters.status === "draft" ? "Draft" : "Published",
          value: currentFilters.status,
        }
      : null
  );

  const { t } = useTranslation();

  const statusOptions = [
    { label: "Draft", value: "draft" },
    { label: "Published", value: "published" },
  ];

  const { data: { categories = [] } = {} } = useFetchCategories();

  const categoryOptions = isEmpty(categories)
    ? []
    : categories.map(category => ({
        label: category.name,
        value: category.name,
      }));

  const handleApplyFilters = values => {
    const filters = {
      name: values.name || null,
      selectedCategories:
        selectedCategories.map(category => category.value) || null,
      status: status?.value || null,
    };

    onApplyFilters(filters);
    onClose();
  };

  const handleClearFilters = () => {
    setName("");
    setSelectedCategories([]);
    setStatus(null);
    onApplyFilters({});
    onClose();
  };

  return (
    <Pane isOpen={isOpen} onClose={onClose}>
      <Pane.Header>
        <Typography className="text-2xl font-bold">
          {t("labels.filter")}
        </Typography>
      </Pane.Header>
      <NeetoUIForm
        formikProps={{
          initialValues,
          validationSchema: filterSchema,
          onSubmit: values => handleApplyFilters(values),
        }}
      >
        {({ setFieldValue }) => (
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
                      initialValues.name = value;
                    }}
                  />
                  <Typography className="text-md font-bold">
                    {t("labels.category")}
                  </Typography>
                  <Select
                    isMulti
                    name="selectedCategories"
                    options={categoryOptions}
                    placeholder={t("inputPlaceholders.quizCategoryInput")}
                    value={selectedCategories}
                    onBlur={() => {
                      if (!selectedCategories.length) {
                        setFieldValue("selectedCategories", null);
                      }
                    }}
                    onChange={value => {
                      setSelectedCategories(value);
                      setFieldValue("selectedCategories", value || null);
                    }}
                  />
                  <Typography className="text-md font-bold">
                    {t("labels.status")}
                  </Typography>
                  <Select
                    name="status"
                    options={statusOptions}
                    placeholder={t("inputPlaceholders.quizStatusInput")}
                    value={status}
                    onBlur={() => {
                      if (!status) {
                        setFieldValue("status", null);
                      }
                    }}
                    onChange={value => {
                      setStatus(value);
                      setFieldValue("status", value || null);
                    }}
                  />
                </div>
              </div>
            </Pane.Body>
            <Pane.Footer className="flex items-center space-x-2">
              <Button
                className="bg-blue-600 px-5 text-white"
                label={t("labels.buttons.addFilter")}
                style="text"
                type="submit"
              />
              <Button
                className="px-5"
                label={t("labels.buttons.clearFilter")}
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

export default FilterPane;
