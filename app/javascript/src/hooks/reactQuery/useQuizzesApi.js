import { QUERY_KEYS } from "constants/query";

import quizzesApi from "apis/quizzes";
import { Toastr } from "neetoui";
import { useQuery, useMutation } from "reactquery";

const handleQuizError = error => {
  Toastr.error(error.message || "Something went wrong!", {
    autoClose: 2000,
  });

  return error;
};

export const useFetchQuizzes = () => {
  const queryConfig = {
    queryKey: [QUERY_KEYS.QUIZ],
    queryFn: async () => {
      try {
        const response = await quizzesApi.fetch();

        return response;
      } catch (error) {
        throw handleQuizError(error);
      }
    },
  };

  return useQuery(queryConfig);
};

export const useShowQuiz = slug => {
  const queryConfig = {
    queryKey: [QUERY_KEYS.QUIZ, slug],
    queryFn: async () => {
      try {
        const response = await quizzesApi.show(slug);

        return response;
      } catch (error) {
        throw handleQuizError(error);
      }
    },
    enabled: !!slug,
  };

  return useQuery(queryConfig);
};

export const useCreateQuiz = () =>
  useMutation({
    mutationKey: [QUERY_KEYS.QUIZ, "create"],
    mutationFn: async payload => {
      try {
        const response = await quizzesApi.create(payload);

        return response;
      } catch (error) {
        throw handleQuizError(error);
      }
    },
  });

export const useUpdateQuiz = () =>
  useMutation({
    mutationKey: [QUERY_KEYS.QUIZ, "update"],
    mutationFn: async ({ slug, payload }) => {
      try {
        const response = await quizzesApi.update(slug, payload);

        return response;
      } catch (error) {
        throw handleQuizError(error);
      }
    },
  });

export const useDeleteQuiz = () =>
  useMutation({
    mutationKey: [QUERY_KEYS.QUIZ, "delete"],
    mutationFn: async slug => {
      try {
        const response = await quizzesApi.destroy(slug);

        return response;
      } catch (error) {
        throw handleQuizError(error);
      }
    },
  });
