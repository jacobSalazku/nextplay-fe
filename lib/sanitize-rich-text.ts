import DOMPurify from 'isomorphic-dompurify';

const CONFIG = {
  ALLOWED_TAGS: [
    'p',
    'br',
    'hr',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'ul',
    'ol',
    'li',
    'blockquote',
    'pre',
    'code',
    'strong',
    'em',
    's',
    'u',
    'mark',
  ],
  ALLOWED_ATTR: ['style'],
};

/**
 * Render-time defense for the rich-text fields. The backend sanitizes on write;
 * this also covers rows stored before that and blocks anything a compromised
 * response could carry.
 */
export function sanitizeRichText(html: string | null | undefined): string {
  if (!html) return '';
  return DOMPurify.sanitize(html, CONFIG);
}
