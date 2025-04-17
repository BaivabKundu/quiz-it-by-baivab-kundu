import React, { useState } from "react";

import { Pagination, Typography } from "@bigbinary/neetoui";
import { useFetchCategories } from "hooks/reactQuery/useCategoriesApi";
import { useFetchOrganization } from "hooks/reactQuery/useOrganizationsApi";
import { useFetchQuizzes } from "hooks/reactQuery/useQuizzesApi";
import useQueryParams from "hooks/useQueryParams";
import { t } from "i18next";
import { mergeLeft, isEmpty } from "ramda";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import routes from "routes";
import { buildUrl } from "utils/url";
import withTitle from "utils/withTitle";

import Card from "./Card";
import { DEFAULT_PAGE_INDEX } from "./constants";
import DashboardHeader from "./Header";
import SearchAndFilter from "./SearchAndFilter";

import ErrorPageLayout from "../../Admin/commons/ErrorPageLayout";

const PublicDashboard = () => {
  const history = useHistory();

  const { t } = useTranslation();

  const queryParams = useQueryParams();
  const { searchTerm, page, filterCategories } = queryParams;

  const [searchValue, setSearchValue] = useState(searchTerm);
  const [filters, setFilters] = useState(() => {
    const initialFilters = {};

    if (filterCategories) {
      initialFilters.selectedCategories = filterCategories.split(",");
    }

    return initialFilters;
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const quizzesParams = {
    searchKey: searchTerm,
    page: Number(page || DEFAULT_PAGE_INDEX),
    status: "published",
    accessibility: "discoverable",
    filters: !isEmpty(filters) ? filters : {},
  };

  const { data: { quizzes: quizResponse = [], meta = {} } = {}, error } =
    useFetchQuizzes(quizzesParams);
  const { data: { organization } = {} } = useFetchOrganization();
  const { data: { categories = [] } = {} } = useFetchCategories();

  const categoryOptions = isEmpty(categories)
    ? []
    : categories.map(category => ({
        label: category.name,
        value: category.name,
      }));

  const handleCategoriesFilter = values => {
    const filters = {
      selectedCategories: values.map(category => category.value) || [],
    };

    const queryParams = {};

    if (filters.selectedCategories && filters.selectedCategories.length > 0) {
      queryParams.filterCategories = filters.selectedCategories.join(",");
    }

    if (searchTerm) {
      queryParams.searchTerm = searchTerm;
    }

    setFilters(filters);
    history.push(buildUrl(routes.public.dashboard, queryParams));
  };

  const handlePageNavigation = newPage => {
    history.push(
      buildUrl(
        routes.public.dashboard,
        mergeLeft({ page: newPage }, queryParams)
      )
    );
  };

  sessionStorage.clear();
  localStorage.removeItem("publicUser");

  if (error) {
    return <ErrorPageLayout status={error.response.status} />;
  }

  return (
    <div className="flex-1 overflow-auto px-4 pb-8">
      <DashboardHeader organizationName={organization?.name} />
      <SearchAndFilter
        categoryOptions={categoryOptions}
        filters={filters}
        handleCategoriesFilter={handleCategoriesFilter}
        isDropdownOpen={isDropdownOpen}
        queryParams={queryParams}
        searchValue={searchValue}
        setIsDropdownOpen={setIsDropdownOpen}
        setSearchValue={setSearchValue}
      />
      {!isEmpty(quizResponse) && !isEmpty(meta) ? (
        <div className="mx-auto w-2/3">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {quizResponse.map(quiz => (
              <Card key={quiz.id} quiz={quiz} />
            ))}
          </div>
          <div className="my-5 flex justify-center">
            <Pagination
              count={meta.totalCount}
              navigate={handlePageNavigation}
              pageNo={Number(page) || DEFAULT_PAGE_INDEX}
              pageSize={meta.itemsPerPage}
            />
          </div>
        </div>
      ) : (
        <div className="flex h-96 items-center justify-center">
          <Typography className="text-xl font-medium">
            {t("messages.noQuizzesAvailable")}
          </Typography>
        </div>
      )}
    </div>
  );
};

export default withTitle(PublicDashboard, t("title.home"));
