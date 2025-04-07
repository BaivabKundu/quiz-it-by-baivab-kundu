import { QUERY_KEYS } from "constants/query";

import quizzesApi from "apis/quizzes";
import { Toastr } from "neetoui";
import { useQuery, useMutation, useQueryClient } from "reactquery";

const handleQuizError = error => {
  Toastr.error(error.message || "Something went wrong!", {
    autoClose: 2000,
  });

  return error;
};

export const useFetchQuizzes = params => {
  const queryClient = useQueryClient();

  const queryConfig = {
    queryKey: [QUERY_KEYS.QUIZ, params],
    queryFn: async () => {
      try {
        const response = await quizzesApi.fetch(params);

        return response;
      } catch (error) {
        throw handleQuizError(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.QUIZ],
      });
    },
    enabled: !!params,
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

export const useCreateQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [QUERY_KEYS.QUIZ, "create"],
    mutationFn: async payload => {
      try {
        await quizzesApi.create(payload);
      } catch (error) {
        throw handleQuizError(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.QUIZ],
      });
    },
  });
};

export const useUpdateQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [QUERY_KEYS.QUIZ, "update"],
    mutationFn: async ({ slug, payload }) => {
      try {
        await quizzesApi.update(slug, payload);
      } catch (error) {
        throw handleQuizError(error);
      }
    },
    onSuccess: (_, { slug }) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.QUIZ, slug],
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.QUIZ],
      });
    },
  });
};

export const useDeleteQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [QUERY_KEYS.QUIZ, "delete"],
    mutationFn: async slug => {
      try {
        await quizzesApi.destroy(slug);
      } catch (error) {
        throw handleQuizError(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.QUIZ],
      });
    },
  });
};

export const useCloneQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [QUERY_KEYS.QUIZ, "clone"],
    mutationFn: async ({ slug }) => {
      try {
        await quizzesApi.clone(slug);
      } catch (error) {
        throw handleQuizError(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.QUIZ],
      });
    },
  });
};

export const useBulkUpdateQuizzes = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [QUERY_KEYS.QUIZ, "bulk_update"],
    mutationFn: async payload => {
      try {
        await quizzesApi.bulkUpdate(payload);
      } catch (error) {
        throw handleQuizError(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.QUIZ],
      });
    },
  });
};

export const useBulkDeleteQuizzes = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [QUERY_KEYS.QUIZ, "bulk_delete"],
    mutationFn: async payload => {
      try {
        await quizzesApi.bulkDelete(payload);
      } catch (error) {
        throw handleQuizError(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.QUIZ],
      });
    },
  });
};
