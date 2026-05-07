import { useQuery } from "@tanstack/react-query";
import { queries } from "../../queries";

type UseGetNewsPaginatedProps = {
  page: number;
  size: number;
  enabled?: boolean;
};

export function useGetNewsPaginated({
  page,
  size,
  enabled,
}: UseGetNewsPaginatedProps) {
  return useQuery({
    ...queries.news.paginated({ page, size }),
    enabled,
  });
}
