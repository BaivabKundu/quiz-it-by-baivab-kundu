import { QUERY_KEYS } from "constants/query";

import authApi from "apis/auth";
import { setAuthHeaders } from "apis/axios";
import { t } from "i18next";
import { Toastr } from "neetoui";
import { useMutation, useQueryClient } from "reactquery";
import { setToLocalStorage, setPublicUserToLocalStorage } from "utils/storage";

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [QUERY_KEYS.AUTH],
    mutationFn: async ({ email, password }) => {
      try {
        const response = await authApi.login({ email, password });
        setToLocalStorage({
          authToken: response.authenticationToken,
          email: email.toLowerCase(),
          userId: response.id,
          userName: response.username,
        });
        setAuthHeaders();

        return response;
      } catch (error) {
        Toastr.error(
          error?.response?.data?.error || t("auth.errors.loginFailed")
        );
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.QUIZ]);
    },
  });
};

export const useSignup = () =>
  useMutation({
    mutationKey: [QUERY_KEYS.AUTH],
    mutationFn: async ({
      username,
      email,
      password,
      password_confirmation,
    }) => {
      try {
        const response = await authApi.signup({
          username,
          email,
          password,
          password_confirmation,
        });

        return response;
      } catch (error) {
        Toastr.error(
          error?.response?.data?.error || t("auth.errors.signupFailed")
        );
        throw error;
      }
    },
  });

export const useRegister = () =>
  useMutation({
    mutationKey: [QUERY_KEYS.AUTH],
    mutationFn: async ({ username, email }) => {
      try {
        const response = await authApi.register({ username, email });
        setPublicUserToLocalStorage(response.id);

        return response;
      } catch (error) {
        Toastr.error(
          error?.response?.data?.error || t("auth.errors.registrationFailed")
        );
        throw error;
      }
    },
  });
