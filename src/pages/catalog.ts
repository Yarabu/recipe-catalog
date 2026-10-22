import { getRecipes, getTags, ApiError } from '../api/recipes';
import { renderRecipeList } from '../components/recipeCard';
import { showLoading, showError, showEmpty, clearState } from '../components/states';
import type { SortField, SortOrder } from '../types';

const PAGE_SIZE = 12;

const form = document.querySelector<HTMLFormElement>('#filters')!;
const qInput = document.querySelector<HTMLInputElement>('#q')!;
const tagSelect = document.querySelector<HTMLSelectElement>('#tag')!;
const sortSelect = document.querySelector<HTMLSelectElement>('#sort')!;
const list = document.querySelector<HTMLUListElement>('#recipe-list')!;
const stateBox = document.querySelector<HTMLElement>('#catalog-state')!;
const resultsInfo = document.querySelector<HTMLElement>('#results-info')!;
const pagination = document.querySelector<HTMLElement>('#pagination')!;
const prevBtn = document.querySelector<HTMLButtonElement>('#prev')!;
const nextBtn = document.querySelector<HTMLButtonElement>('#next')!;
const pageInfo = document.querySelector<HTMLElement>('#page-info')!;

const state = {
  search: '',
  tag: '',
  sortBy: undefined as SortField | undefined,
  order: undefined as SortOrder | undefined,
  page: 1,
};

let controller: AbortController | null = null;

async function load(): Promise<void> {
  controller?.abort();
  controller = new AbortController();
  const { signal } = controller;

  showLoading(stateBox, 'Loading recipes…');
  list.innerHTML = '';
  pagination.hidden = true;
  resultsInfo.textContent = '';

  try {
    const data = await getRecipes(
      {
        search: state.search || undefined,
        tag: state.tag || undefined,
        sortBy: state.sortBy,
        order: state.order,
        limit: PAGE_SIZE,
        skip: (state.page - 1) * PAGE_SIZE,
      },
      signal,
    );

    if (data.recipes.length === 0) {
      showEmpty(stateBox, 'Nothing found. Try a different search term.');
      return;
    }

    clearState(stateBox);
    list.innerHTML = renderRecipeList(data.recipes);
    resultsInfo.textContent = `Found recipes: ${data.total}`;

    const totalPages = Math.max(1, Math.ceil(data.total / PAGE_SIZE));
    pagination.hidden = totalPages <= 1;
    pageInfo.textContent = `Page ${state.page} of ${totalPages}`;
    prevBtn.disabled = state.page <= 1;
    nextBtn.disabled = state.page >= totalPages;
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') return;
    const message = err instanceof ApiError ? err.message : 'An unexpected error occurred.';
    showError(stateBox, message, load);
  }
}

async function loadTags(): Promise<void> {
  try {
    const tags = await getTags();
    for (const tag of tags) {
      const option = document.createElement('option');
      option.value = tag;
      option.textContent = tag;
      tagSelect.append(option);
    }
  } catch {
  }
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  state.search = qInput.value.trim();
  state.tag = '';
  tagSelect.value = '';
  state.page = 1;
  void load();
});

tagSelect.addEventListener('change', () => {
  state.tag = tagSelect.value;
  state.search = '';
  qInput.value = '';
  state.page = 1;
  void load();
});

sortSelect.addEventListener('change', () => {
  if (sortSelect.value) {
    const [field, order] = sortSelect.value.split(':');
    state.sortBy = field as SortField;
    state.order = order as SortOrder;
  } else {
    state.sortBy = undefined;
    state.order = undefined;
  }
  state.page = 1;
  void load();
});

form.addEventListener('reset', () => {
  setTimeout(() => {
    state.search = '';
    state.tag = '';
    state.sortBy = undefined;
    state.order = undefined;
    state.page = 1;
    void load();
  });
});

prevBtn.addEventListener('click', () => {
  if (state.page > 1) {
    state.page -= 1;
    void load();
    window.scrollTo({ top: 0 });
  }
});

nextBtn.addEventListener('click', () => {
  state.page += 1;
  void load();
  window.scrollTo({ top: 0 });
});

const params = new URLSearchParams(location.search);
const initialQuery = params.get('q');
const initialTag = params.get('tag');

if (initialQuery) {
  state.search = initialQuery.trim();
  qInput.value = state.search;
} else if (initialTag) {
  state.tag = initialTag;
}

void loadTags().then(() => {
  if (state.tag) tagSelect.value = state.tag;
});
void load();