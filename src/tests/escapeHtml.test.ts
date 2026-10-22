import { describe, it, expect } from 'vitest';
import { escapeHtml } from '../utils/dom';

describe('escapeHtml', () => {
  it('escapes HTML tags', () => {
    expect(escapeHtml('<script>alert(1)</script>')).toBe(
      '&lt;script&gt;alert(1)&lt;/script&gt;',
    );
  });

  it('escapes quotes and ampersand', () => {
    expect(escapeHtml(`Tom & "Jerry's"`)).toBe('Tom &amp; &quot;Jerry&#39;s&quot;');
  });

  it('does not modify regular text', () => {
    expect(escapeHtml('Pizza Margherita')).toBe('Pizza Margherita');
  });
});