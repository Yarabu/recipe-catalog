import type { Recipe } from '../types';
import { escapeHtml } from '../utils/dom';

export function renderRecipeCard(recipe: Recipe): string {
  const totalTime = recipe.prepTimeMinutes + recipe.cookTimeMinutes;
  const name = escapeHtml(recipe.name);

  return `
    <li>
      <article class="card">
        <img
          class="card__img"
          src="${escapeHtml(recipe.image)}"
          alt="${name}"
          width="400"
          height="300"
          loading="lazy"
        />
        <div class="card__body">
          <h3 class="card__title">
            <a href="recipe.html?id=${recipe.id}">${name}</a>
          </h3>
          <p class="card__meta">${escapeHtml(recipe.cuisine)} · ${escapeHtml(recipe.difficulty)}</p>
          <p class="card__meta">
            <span aria-label="Rating ${recipe.rating} out of 5">★ ${recipe.rating.toFixed(1)}</span>
            · ${totalTime} min
          </p>
        </div>
      </article>
    </li>`;
}

export function renderRecipeList(recipes: Recipe[]): string {
  return recipes.map(renderRecipeCard).join('');
}