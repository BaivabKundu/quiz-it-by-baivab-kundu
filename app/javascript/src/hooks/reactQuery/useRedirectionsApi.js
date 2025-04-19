import { QUERY_KEYS } from "constants/query";

import redirectionsApi from "apis/redirections";
import { Toastr } from "neetoui";
import { useQuery, useMutation, useQueryClient } from "reactquery";

const handleRedirectionError = error => {
  Toastr.error(error.message || "Something went wrong!", {
    autoClose: 2000,
  });

  return error;
};

export const useFetchRedirections = () => {
  const queryClient = useQueryClient();

  const queryConfig = {
    queryKey: [QUERY_KEYS.REDIRECTION],
    queryFn: async () => {
      try {
        const response = await redirectionsApi.fetch();

        return response;
      } catch (error) {
        throw handleRedirectionError(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.REDIRECTION],
      });
    },
  };

  return useQuery(queryConfig);
};

export const useCreateRedirection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [QUERY_KEYS.REDIRECTION, "create"],
    mutationFn: async payload => {
      try {
        const response = await redirectionsApi.create(payload);

        return response;
      } catch (error) {
        throw handleRedirectionError(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.REDIRECTION],
      });
    },
  });
};

export const useUpdateRedirection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [QUERY_KEYS.REDIRECTION, "update"],
    mutationFn: async ({ id, payload }) => {
      try {
        await redirectionsApi.update(id, payload);
      } catch (error) {
        throw handleRedirectionError(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.REDIRECTION],
      });
    },
  });
};

export const useDeleteRedirection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [QUERY_KEYS.REDIRECTION, "delete"],
    mutationFn: async id => {
      try {
        await redirectionsApi.destroy(id);
      } catch (error) {
        throw handleRedirectionError(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.REDIRECTION],
      });
    },
  });
};
