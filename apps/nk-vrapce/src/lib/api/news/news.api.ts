import { useGetLatestNews } from "./api_hooks/useGetLatestNews";
import { useGetNewsPaginated } from "./api_hooks/useGetNewsPaginated";

export const newsApi = {
  useGetLatestNews,
  useGetNewsPaginated,
};
