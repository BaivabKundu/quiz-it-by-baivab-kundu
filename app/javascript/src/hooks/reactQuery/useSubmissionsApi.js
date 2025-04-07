import { QUERY_KEYS } from "constants/query";

import submissionsApi from "apis/submissions";
import { Toastr } from "neetoui";
import { useQuery, useQueryClient, useMutation } from "reactquery";

const handleSubmissionError = error => {
  Toastr.error(error.message || "Something went wrong!", {
    autoClose: 2000,
  });

  return error;
};

export const useFetchSubmissions = (slug, params) => {
  const queryClient = useQueryClient();

  const queryConfig = {
    queryKey: [QUERY_KEYS.SUBMISSION, slug, params],
    queryFn: async () => {
      try {
        const response = await submissionsApi.fetch(slug, params);

        return response;
      } catch (error) {
        throw handleSubmissionError(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.SUBMISSION],
      });
    },
    enabled: !!slug,
    placeholderData: keepPreviousData => keepPreviousData,
  };

  return useQuery(queryConfig);
};

export const useGeneratePdf = slug =>
  useMutation({
    mutationFn: async () => await submissionsApi.generatePdf(slug),
    onError: error => handleSubmissionError(error),
  });

export const useDownloadPdf = () =>
  useMutation({
    mutationFn: async () => await submissionsApi.downloadPdf(),
    onError: error => handleSubmissionError(error),
  });
