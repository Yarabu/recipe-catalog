export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface Recipe {
  id: number;
  name: string;
  ingredients: string[];
  instructions: string[];
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: Difficulty;
  cuisine: string;
  caloriesPerServing: number;
  tags: string[];
  userId: number;
  image: string;
  rating: number;
  reviewCount: number;
  mealType: string[];
}

export interface RecipesResponse {
  recipes: Recipe[];
  total: number;
  skip: number;
  limit: number;
}

export type SortField = 'name' | 'rating' | 'prepTimeMinutes';
export type SortOrder = 'asc' | 'desc';

export interface RecipeQuery {
  search?: string;
  tag?: string;
  sortBy?: SortField;
  order?: SortOrder;
  limit?: number;
  skip?: number;
}