import { getRecipes, getTags, ApiError } from '../api/recipes';
import { renderRecipeList } from '../components/recipeCard';
import { showLoading, showError, clearState } from '../components/states';
import { escapeHtml } from '../utils/dom';

const featuredList = document.querySelector<HTMLUListElement>('#featured-list')!;
const featuredState = document.querySelector<HTMLElement>('#featured-state')!;
const tagList = document.querySelector<HTMLUListElement>('#tag-list')!;

async function loadFeatured(): Promise<void> {
  showLoading(featuredState, 'Loading recipes…');
  featuredList.innerHTML = '';

  try {
    const data = await getRecipes({ sortBy: 'rating', order: 'desc', limit: 4 });
    clearState(featuredState);
    featuredList.innerHTML = renderRecipeList(data.recipes);
  } catch (err) {
    const message = err instanceof ApiError ? err.message : 'An unexpected error occurred.';
    showError(featuredState, message, loadFeatured);
  }
}

async function loadTags(): Promise<void> {
  try {
    const tags = await getTags();
    tagList.innerHTML = tags
      .slice(0, 12)
      .map(
        (tag) =>
          `<li><a class="chip" href="catalog.html?tag=${encodeURIComponent(tag)}">${escapeHtml(tag)}</a></li>`,
      )
      .join('');
  } catch {
    tagList.closest('section')?.setAttribute('hidden', '');
  }
}

void loadTags();
void loadFeatured();