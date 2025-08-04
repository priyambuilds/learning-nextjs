import qs from "query-string";

export const formUrlQuery = ({ params, key, value }) => {
  const currentUrl = qs.parse(params);
};

export const removeKeysFromQuery = () => {};
