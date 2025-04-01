import { QUERY_KEYS } from "constants/query";

import questionsApi from "apis/questions";
import { Toastr } from "neetoui";
import { useQuery, useMutation, useQueryClient } from "reactquery";

const handleQuestionError = error => {
  Toastr.error(error.message || "Something went wrong!", {
    autoClose: 2000,
  });

  return error;
};

export const useFetchQuestions = quizSlug => {
  const queryClient = useQueryClient();

  const queryConfig = {
    queryKey: [QUERY_KEYS.QUESTION],
    queryFn: async () => {
      try {
        const response = await questionsApi.fetch(quizSlug);

        return response;
      } catch (error) {
        throw handleQuestionError(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.QUESTION],
      });
    },
  };

  return useQuery(queryConfig);
};

export const useShowQuestion = questionId => {
  const queryConfig = {
    queryKey: [QUERY_KEYS.QUESTION, questionId],
    queryFn: async () => {
      try {
        const response = await questionsApi.show(questionId);

        return response;
      } catch (error) {
        throw handleQuestionError(error);
      }
    },
    enabled: !!questionId,
  };

  return useQuery(queryConfig);
};

export const useCreateQuestion = quizSlug => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [QUERY_KEYS.QUESTION, "create"],
    mutationFn: async payload => {
      try {
        await questionsApi.create(quizSlug, payload);
      } catch (error) {
        throw handleQuestionError(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.QUESTION],
      });
    },
  });
};

export const useUpdateQuestion = () =>
  useMutation({
    mutationKey: [QUERY_KEYS.QUESTION, "update"],
    mutationFn: async ({ questionId, payload }) => {
      try {
        await questionsApi.update(questionId, payload);
      } catch (error) {
        throw handleQuestionError(error);
      }
    },
  });

export const useDeleteQuestion = () =>
  useMutation({
    mutationKey: [QUERY_KEYS.QUESTION, "delete"],
    mutationFn: async questionId => {
      try {
        await questionsApi.destroy(questionId);
      } catch (error) {
        throw handleQuestionError(error);
      }
    },
  });
