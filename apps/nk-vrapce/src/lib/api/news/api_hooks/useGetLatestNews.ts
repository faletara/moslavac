import { useQuery } from "@tanstack/react-query";
import { queries } from "../../queries";

type UseGetLatestNewsProps = {
  enabled?: boolean;
};

export function useGetLatestNews(props?: UseGetLatestNewsProps) {
  return useQuery({
    ...queries.news.latest(),
    enabled: props?.enabled,
  });
}
