export interface News {
  id: number;
  slug: string | null;
  title: string;
  content: string;
  date: string;
  thumbnailPath: string | null;
  imagePaths: string[];
  tenantId: string;
}

export interface PaginatedNews {
  content: News[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}
