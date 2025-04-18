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

export const useFetchSubmissions = (slug, { searchKey, page, filters }) => {
  const queryClient = useQueryClient();

  const queryConfig = {
    queryKey: [QUERY_KEYS.SUBMISSION, slug, searchKey, page, filters],
    queryFn: async () => {
      try {
        const response = await submissionsApi.fetch({
          slug,
          searchKey,
          page,
          filters,
        });

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

export const useFetchResult = (slug, userId, submissionId) => {
  const queryClient = useQueryClient();

  const queryConfig = {
    queryKey: [QUERY_KEYS.SUBMISSION_RESULT, slug, userId, submissionId],
    queryFn: async () => {
      try {
        const response = await submissionsApi.fetchResult(submissionId, {
          slug,
          userId,
        });

        return response;
      } catch (error) {
        throw handleSubmissionError(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.QUIZ],
      });
    },
    enabled: !!slug,
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

export const useCreateSubmission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async payload => {
      try {
        const response = await submissionsApi.create(payload);
        sessionStorage.setItem("submissionId", response.id);

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
  });
};

export const useUpdateSubmission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }) => {
      try {
        const response = await submissionsApi.update(id, payload);

        return response;
      } catch (error) {
        throw handleSubmissionError(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.SUBMISSION],
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.QUIZ],
      });
    },
  });
};
