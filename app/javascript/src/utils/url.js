import { keysToSnakeCase } from "neetocist";
import { stringify } from "qs";
import { either, isEmpty, isNil, pipe } from "ramda";

const PROTOCOL_REGEXP = /^https?:\/\//i;

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

export const stripDomainFromUrl = url =>
  url.replace(PROTOCOL_REGEXP, "").split("/").slice(1).join("/");

export const prefixUrl = (url, baseUrl, replaceDomain = false) => {
  if (either(isNil, isEmpty)(url)) return baseUrl;

  const withoutProtocol = url.replace(PROTOCOL_REGEXP, "");
  const urlSegments = withoutProtocol.split("/");
  const isDomainPresent = urlSegments[0].includes(".");

  if (replaceDomain && isDomainPresent) {
    const path = urlSegments.slice(1).join("/");

    return `${baseUrl}/${path.replace(/^\/+/, "")}`;
  }

  if (isDomainPresent) {
    return `http://${withoutProtocol}`;
  }

  return `${baseUrl}/${withoutProtocol.replace(/^\/+/, "")}`;
};
