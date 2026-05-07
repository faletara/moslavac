import { ApiError } from "./errors";

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new ApiError(response.status, data);
  }

  return response.json();
}

apiFetch.get = <T>(path: string, options?: RequestInit) =>
  apiFetch<T>(path, { ...options, method: "GET" });

apiFetch.post = <T>(path: string, body: unknown, options?: RequestInit) =>
  apiFetch<T>(path, {
    ...options,
    method: "POST",
    body: JSON.stringify(body),
  });

export { apiFetch };
