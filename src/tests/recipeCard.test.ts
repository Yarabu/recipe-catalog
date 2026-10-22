import { describe, it, expect } from 'vitest';
import { renderRecipeCard } from '../components/recipeCard';
import type { Recipe } from '../types';

const recipe: Recipe = {
  id: 7,
  name: 'Pasta <b>Carbonara</b>',
  ingredients: ['Pasta', 'Eggs'],
  instructions: ['Boil', 'Mix'],
  prepTimeMinutes: 10,
  cookTimeMinutes: 15,
  servings: 2,
  difficulty: 'Easy',
  cuisine: 'Italian',
  caloriesPerServing: 500,
  tags: ['Pasta'],
  userId: 1,
  image: 'https://example.com/pasta.jpg',
  rating: 4.65,
  reviewCount: 20,
  mealType: ['Dinner'],
};

describe('renderRecipeCard', () => {
  it('contains a link to the detail page with id', () => {
    expect(renderRecipeCard(recipe)).toContain('href="recipe.html?id=7"');
  });

  it('escapes the recipe name', () => {
    const html = renderRecipeCard(recipe);
    expect(html).not.toContain('<b>Carbonara</b>');
    expect(html).toContain('&lt;b&gt;Carbonara&lt;/b&gt;');
  });

  it('shows the total preparation time', () => {
    expect(renderRecipeCard(recipe)).toContain('25 min');
  });

  it('has alt text for the image', () => {
    expect(renderRecipeCard(recipe)).toMatch(/<img[^>]+alt="/);
  });
});