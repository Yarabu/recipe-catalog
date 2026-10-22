import { getRecipeById, ApiError } from '../api/recipes';
import { showLoading, showError } from '../components/states';
import { escapeHtml } from '../utils/dom';
import type { Recipe } from '../types';

const stateBox = document.querySelector<HTMLElement>('#recipe-state')!;
const content = document.querySelector<HTMLElement>('#recipe-content')!;

function renderRecipe(recipe: Recipe): string {
  const name = escapeHtml(recipe.name);
  const total = recipe.prepTimeMinutes + recipe.cookTimeMinutes;

  return `
    <div class="recipe__header">
      <img class="recipe__img" src="${escapeHtml(recipe.image)}" alt="${name}" width="600" height="450" />
      <div>
        <h1>${name}</h1>
        <p>
          <span aria-label="Rating ${recipe.rating} out of 5">★ ${recipe.rating.toFixed(1)}</span>
          (${recipe.reviewCount} reviews)
        </p>
        <dl class="recipe__facts">
          <div><dt>Cuisine</dt><dd>${escapeHtml(recipe.cuisine)}</dd></div>
          <div><dt>Difficulty</dt><dd>${escapeHtml(recipe.difficulty)}</dd></div>
          <div><dt>Total time</dt><dd>${total} min</dd></div>
          <div><dt>Servings</dt><dd>${recipe.servings}</dd></div>
          <div><dt>Calories</dt><dd>${recipe.caloriesPerServing} kcal</dd></div>
        </dl>
        <ul class="chip-list" aria-label="Tags">
          ${recipe.tags
            .map(
              (tag) =>
                `<li><a class="chip" href="catalog.html?tag=${encodeURIComponent(tag)}">${escapeHtml(tag)}</a></li>`,
            )
            .join('')}
        </ul>
      </div>
    </div>

    <div class="recipe__columns">
      <section aria-labelledby="ingredients-title">
        <h2 id="ingredients-title">Ingredients</h2>
        <ul class="ingredients">
          ${recipe.ingredients.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
        </ul>
      </section>
      <section aria-labelledby="steps-title">
        <h2 id="steps-title">Instructions</h2>
        <ol>
          ${recipe.instructions.map((step) => `<li>${escapeHtml(step)}</li>`).join('')}
        </ol>
      </section>
    </div>`;
}

async function load(): Promise<void> {
  const id = Number(new URLSearchParams(location.search).get('id'));

  if (!Number.isInteger(id) || id <= 0) {
    showError(stateBox, 'Invalid recipe link.');
    return;
  }

  content.hidden = true;
  showLoading(stateBox, 'Loading recipe…');

  try {
    const recipe = await getRecipeById(id);
    stateBox.innerHTML = '';
    document.title = `${recipe.name} — Recipe Catalog`;
    content.innerHTML = renderRecipe(recipe);
    content.hidden = false;
  } catch (err) {
    const message =
      err instanceof ApiError && err.status === 404
        ? 'This recipe does not exist.'
        : err instanceof ApiError
          ? err.message
          : 'An unexpected error occurred.';
    showError(stateBox, message, load);
  }
}

void load();