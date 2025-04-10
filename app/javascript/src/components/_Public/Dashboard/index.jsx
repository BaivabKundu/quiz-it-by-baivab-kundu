import React, { useState } from "react";

import { Search, Filter as FilterIcon } from "@bigbinary/neeto-icons";
import {
  Button,
  Dropdown,
  Input,
  Pagination,
  Select,
  Typography,
} from "@bigbinary/neetoui";
import { useFetchCategories } from "hooks/reactQuery/useCategoriesApi";
import { useShowOrganization } from "hooks/reactQuery/useOrganizationsApi";
import { useFetchQuizzes } from "hooks/reactQuery/useQuizzesApi";
import useQueryParams from "hooks/useQueryParams";
import Header from "neetomolecules/Header";
import { mergeLeft, isEmpty } from "ramda";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { buildUrl } from "utils/url";

import Card from "./Card";
import { DEFAULT_PAGE_INDEX } from "./constants";

import routes from "../../../routes";

const PublicDashboard = () => {
  const history = useHistory();

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
    filters: !isEmpty(filters) ? filters : {},
  };

  const { data: { quizzes: quizResponse = [], meta = {} } = {} } =
    useFetchQuizzes(quizzesParams);
  const { data: { organization } = {} } = useShowOrganization();
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

  return (
    <div className="flex-1 overflow-auto px-4 pb-8">
      <Header
        className="px-5"
        title={organization?.name}
        actionBlock={
          <Button
            className="bg-blue-600"
            label="Login as admin"
            to="/admin/login"
          />
        }
      />
      <div className="mx-auto my-10 flex w-1/3 items-center space-x-2">
        <Input
          name="name"
          placeholder="Search for a quiz"
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
            <Typography className="py-2">Category</Typography>
            <Select
              isMulti
              name="selectedCategories"
              options={categoryOptions}
              placeholder="Select categories"
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
      {!isEmpty(quizResponse) && !isEmpty(meta) && (
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
      )}
    </div>
  );
};

export default PublicDashboard;
