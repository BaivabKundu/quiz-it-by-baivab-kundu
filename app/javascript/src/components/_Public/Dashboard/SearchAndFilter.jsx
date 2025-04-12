import React from "react";

import { Search, Filter as FilterIcon } from "@bigbinary/neeto-icons";
import { Dropdown, Input, Select, Typography } from "@bigbinary/neetoui";
import { mergeLeft } from "ramda";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { buildUrl } from "utils/url";

import routes from "../../../routes";

const SearchAndFilter = ({
  searchValue,
  setSearchValue,
  isDropdownOpen,
  setIsDropdownOpen,
  filters,
  handleCategoriesFilter,
  categoryOptions,
  queryParams,
}) => {
  const history = useHistory();
  const { t } = useTranslation();

  return (
    <div className="mx-auto my-10 flex w-1/3 items-center space-x-2">
      <Input
        name="name"
        placeholder={t("inputPlaceholders.publicSearch")}
        prefix={<Search />}
        value={searchValue}
        onChange={event => {
          setSearchValue(event.target.value);
          history.push(
            buildUrl(
              routes.public.dashboard,
              mergeLeft({ searchTerm: event.target.value }, queryParams)
            )
          );
        }}
      />
      <Dropdown
        className="p-3"
        closeOnSelect={false}
        isOpen={isDropdownOpen}
        customTarget={
          <FilterIcon
            className="h-6 w-6 cursor-pointer text-gray-700"
            onClick={() => setIsDropdownOpen(prev => !prev)}
          />
        }
      >
        <div className="overflow-y-hidden">
          <Typography className="py-2">{t("labels.category")}</Typography>
          <Select
            isMulti
            name="selectedCategories"
            options={categoryOptions}
            placeholder={t("inputPlaceholders.quizCategoryInput")}
            styles={{
              menu: base => ({
                ...base,
                position: "relative",
                zIndex: 10,
              }),
              menuList: base => ({
                ...base,
                height: "200px",
              }),
            }}
            value={
              filters.selectedCategories?.map(category => ({
                label: category,
                value: category,
              })) || []
            }
            onChange={value => {
              handleCategoriesFilter(value);
            }}
          />
        </div>
      </Dropdown>
    </div>
  );
};

export default SearchAndFilter;
