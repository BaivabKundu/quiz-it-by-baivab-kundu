import { keysToSnakeCase } from "neetocist";
import { stringify } from "qs";
import { isEmpty, pipe } from "ramda";

export const buildUrl = (route, params) => {
  const queryParams = pipe(keysToSnakeCase, stringify)(params);

  return isEmpty(queryParams) ? route : `${route}?${queryParams}`;
};

export const buildRoute = (route, quizSlug, questionId, userId) => {
  if (questionId) {
    return route.replace(`:slug`, quizSlug).replace(`:id`, questionId);
  }

  if (userId) {
    return route.replace(`:slug`, quizSlug).replace(`:userId`, userId);
  }

  return route.replace(`:slug`, quizSlug);
};
