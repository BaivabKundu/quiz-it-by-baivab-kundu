import { QUERY_KEYS } from "constants/query";

import authApi from "apis/auth";
import { setAuthHeaders } from "apis/axios";
import { t } from "i18next";
import { Toastr } from "neetoui";
import { useMutation } from "reactquery";
import { setToLocalStorage } from "utils/storage";

export const useLogin = () =>
  useMutation({
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
  });

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
