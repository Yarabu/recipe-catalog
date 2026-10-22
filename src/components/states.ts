import { escapeHtml } from '../utils/dom';

export function showLoading(container: HTMLElement, text = 'Loading…'): void {
  container.innerHTML = `
    <div class="state" role="status">
      <div class="spinner" aria-hidden="true"></div>
      <p>${escapeHtml(text)}</p>
    </div>`;
}

export function showError(
  container: HTMLElement,
  message: string,
  onRetry?: () => void,
): void {
  container.innerHTML = `
    <div class="state state--error" role="alert">
      <p>${escapeHtml(message)}</p>
      ${onRetry ? '<button type="button" class="btn btn--primary" data-retry>Try again</button>' : ''}
    </div>`;

  if (onRetry) {
    container.querySelector<HTMLButtonElement>('[data-retry]')?.addEventListener('click', onRetry);
  }
}

export function showEmpty(container: HTMLElement, message = 'Nothing found.'): void {
  container.innerHTML = `
    <div class="state" role="status">
      <p>${escapeHtml(message)}</p>
    </div>`;
}

export function clearState(container: HTMLElement): void {
  container.innerHTML = '';
}