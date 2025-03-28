import { QUERY_KEYS } from "constants/query";

import categoriesApi from "apis/categories";
import { Toastr } from "neetoui";
import { useQuery, useMutation } from "reactquery";

const handleCategoryError = error => {
  Toastr.error(error.message || "Something went wrong!", {
    autoClose: 2000,
  });

  return error;
};

export const useFetchCategories = () => {
  const queryConfig = {
    queryKey: [QUERY_KEYS.CATEGORIES],
    queryFn: async () => {
      try {
        const response = await categoriesApi.fetch();

        return response;
      } catch (error) {
        throw handleCategoryError(error);
      }
    },
  };

  return useQuery(queryConfig);
};

export const useCreateCategory = () =>
  useMutation({
    mutationKey: [QUERY_KEYS.CATEGORIES],
    mutationFn: async payload => {
      try {
        const response = await categoriesApi.create(payload);

        return response;
      } catch (error) {
        throw handleCategoryError(error);
      }
    },
  });
