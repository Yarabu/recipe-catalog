import type { Recipe, RecipesResponse, RecipeQuery } from '../types';

const BASE_URL = 'https://dummyjson.com/recipes';

export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request<T>(url: string, signal?: AbortSignal): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url, { signal });
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') throw err;
    throw new ApiError('Cannot connect to the server. Check your internet connection.');
  }

  if (!response.ok) {
    if (response.status === 404) throw new ApiError('Nothing found.', 404);
    throw new ApiError(`Server error (${response.status}).`, response.status);
  }
  return (await response.json()) as T;
}

export function getRecipes(
  query: RecipeQuery = {},
  signal?: AbortSignal,
): Promise<RecipesResponse> {
  const { search, tag, sortBy, order, limit = 12, skip = 0 } = query;

  let path = BASE_URL;
  if (search) path += '/search';
  else if (tag) path += `/tag/${encodeURIComponent(tag)}`;

  const params = new URLSearchParams({ limit: String(limit), skip: String(skip) });
  if (search) params.set('q', search);
  if (sortBy) {
    params.set('sortBy', sortBy);
    params.set('order', order ?? 'asc');
  }

  return request<RecipesResponse>(`${path}?${params}`, signal);
}

export function getRecipeById(id: number, signal?: AbortSignal): Promise<Recipe> {
  return request<Recipe>(`${BASE_URL}/${id}`, signal);
}

export function getTags(signal?: AbortSignal): Promise<string[]> {
  return request<string[]>(`${BASE_URL}/tags`, signal);
}