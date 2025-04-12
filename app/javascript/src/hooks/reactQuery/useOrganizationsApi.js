import { QUERY_KEYS } from "constants/query";

import organizationsApi from "apis/organizations";
import { Toastr } from "neetoui";
import { useQuery, useMutation } from "reactquery";

const handleOrganizationError = error => {
  Toastr.error(error.message || "Something went wrong!", {
    autoClose: 2000,
  });

  return error;
};

export const useFetchOrganization = () => {
  const queryConfig = {
    queryKey: [QUERY_KEYS.ORGANIZATION],
    queryFn: async () => {
      try {
        const response = await organizationsApi.fetch();

        return response;
      } catch (error) {
        throw handleOrganizationError(error);
      }
    },
  };

  return useQuery(queryConfig);
};

export const useUpdateOrganization = () =>
  useMutation({
    mutationKey: [QUERY_KEYS.ORGANIZATION],
    mutationFn: async ({ id, payload }) => {
      try {
        const response = await organizationsApi.update(id, payload);

        return response;
      } catch (error) {
        throw handleOrganizationError(error);
      }
    },
  });
