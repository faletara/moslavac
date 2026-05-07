import { createQueryKeys } from "@lukemorales/query-key-factory";
import { apiFetch } from "../client";
import type { News, PaginatedNews } from "@/types/news";

export async function fetchLatestNews(): Promise<News[]> {
  return apiFetch.get<News[]>("/api/news/latest");
}

export async function fetchNewsPaginated(params: {
  page: number;
  size: number;
}): Promise<PaginatedNews> {
  return apiFetch.get<PaginatedNews>(
    `/api/news?page=${params.page}&size=${params.size}`,
  );
}

export async function fetchNewsDetail(params: {
  newsId: number;
}): Promise<News> {
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
