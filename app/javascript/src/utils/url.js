import { keysToSnakeCase } from "neetocist";
import { stringify } from "qs";
import { isEmpty, pipe } from "ramda";

export const buildUrl = (route, params) => {
  const queryParams = pipe(keysToSnakeCase, stringify)(params);

  return isEmpty(queryParams) ? route : `${route}?${queryParams}`;
};
