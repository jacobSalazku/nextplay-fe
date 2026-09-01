import { describe, expect, it } from 'vitest';
import { sanitizeRichText } from '@/lib/sanitize-rich-text';

describe('sanitizeRichText', () => {
  it('returns empty for nullish input', () => {
    expect(sanitizeRichText(null)).toBe('');
    expect(sanitizeRichText(undefined)).toBe('');
  });

  it('keeps editor formatting', () => {
    const html =
      '<h2>Play</h2><p><strong>Hard</strong> hedge</p><ul><li>Ice</li></ul>';
    expect(sanitizeRichText(html)).toBe(html);
  });

  it('strips scripts and event handlers', () => {
    expect(
      sanitizeRichText('<p onclick="x()">ok</p><script>steal()</script>'),
    ).toBe('<p>ok</p>');
  });

  it('drops an onerror image payload', () => {
    expect(sanitizeRichText('<img src=x onerror="steal()">')).toBe('');
  });
});
