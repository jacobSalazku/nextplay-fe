import { RichText, runsFrom } from '../utils/rich-text';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

// @react-pdf primitives → plain host elements so we can assert on the output
vi.mock('@react-pdf/renderer', () => ({
  StyleSheet: { create: <T,>(s: T) => s },
  Text: ({ children }: { children?: React.ReactNode }) => (
    <span>{children}</span>
  ),
  View: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
}));

describe('runsFrom', () => {
  it('tracks nested inline emphasis', () => {
    const runs = runsFrom('plain <strong>bold <em>both</em></strong> tail');
    expect(runs).toEqual([
      expect.objectContaining({ text: 'plain ', bold: false, italic: false }),
      expect.objectContaining({ text: 'bold ', bold: true, italic: false }),
      expect.objectContaining({ text: 'both', bold: true, italic: true }),
      expect.objectContaining({ text: ' tail', bold: false, italic: false }),
    ]);
  });
});

describe('RichText', () => {
  it('renders a fallback line when there are no notes', () => {
    render(<div>{RichText({ html: '  ' })}</div>);
    expect(screen.getByText(/no notes for this phase/i)).toBeInTheDocument();
  });

  it('keeps paragraph text and inline emphasis', () => {
    render(
      <div>
        {RichText({
          html: '<p>1 passes to <strong>5</strong> on the wing</p>',
        })}
      </div>,
    );
    expect(screen.getByText('1 passes to')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('on the wing')).toBeInTheDocument();
  });

  it('turns list items into bulleted rows', () => {
    render(
      <div>
        {RichText({
          html: '<ul><li>4 sets a screen</li><li>2 fills the corner</li></ul>',
        })}
      </div>,
    );
    expect(screen.getByText('4 sets a screen')).toBeInTheDocument();
    expect(screen.getByText('2 fills the corner')).toBeInTheDocument();
    expect(screen.getAllByText('•')).toHaveLength(2);
  });

  it('falls back to plain text for markup it does not model', () => {
    render(
      <div>{RichText({ html: '<div>loose <span>text</span></div>' })}</div>,
    );
    expect(screen.getByText(/loose text/)).toBeInTheDocument();
  });
});
