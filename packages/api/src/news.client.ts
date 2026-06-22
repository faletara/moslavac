import { createQueryKeys } from "@lukemorales/query-key-factory";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "./client";
import type { News, PaginatedNews } from "@/types/news";

// HTTP fetchers — browser → route handler. Server components call lib/ directly.
async function fetchLatestNews(): Promise<News[]> {
  return apiFetch.get<News[]>("/api/news/latest");
}

async function fetchNewsPaginated(params: {
  page: number;
  size: number;
}): Promise<PaginatedNews> {
  return apiFetch.get<PaginatedNews>(
    `/api/news?page=${params.page}&size=${params.size}`,
  );
}

async function fetchNewsDetail(params: { newsId: number }): Promise<News> {
  return apiFetch.get<News>(`/api/news/${params.newsId}`);
}

export const newsQueries = createQueryKeys("news", {
  latest: () => ({
    queryKey: ["latest"],
    queryFn: fetchLatestNews,
  }),
  paginated: ({ page, size }: { page: number; size: number }) => ({
    queryKey: [{ page, size }],
    queryFn: () => fetchNewsPaginated({ page, size }),
  }),
  detail: ({ newsId }: { newsId: number }) => ({
    queryKey: [newsId],
    queryFn: () => fetchNewsDetail({ newsId }),
  }),
});

export function useGetLatestNews(props?: { enabled?: boolean }) {
  return useQuery({ ...newsQueries.latest(), enabled: props?.enabled });
}

export function useGetNewsPaginated({
  page,
  size,
  enabled,
}: {
  page: number;
  size: number;
  enabled?: boolean;
}) {
  return useQuery({ ...newsQueries.paginated({ page, size }), enabled });
}

export const newsApi = {
  useGetLatestNews,
  useGetNewsPaginated,
};
