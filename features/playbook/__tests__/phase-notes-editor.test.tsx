import { PhaseNotesEditor } from '../components/editor/breakdown/phase-notes-editor';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

function renderEditor(overrides = {}) {
  const props = {
    phaseId: 'p1',
    content: '<p>Punch it inside</p>',
    onChange: vi.fn(),
    onEditStart: vi.fn(),
    onEditEnd: vi.fn(),
    ...overrides,
  };
  render(<PhaseNotesEditor {...props} />);
  return props;
}

describe('PhaseNotesEditor', () => {
  it('renders the existing note and the formatting toolbar', async () => {
    renderEditor();

    // the editor mounts asynchronously (immediatelyRender: false)
    await waitFor(() =>
      expect(screen.getByText('Punch it inside')).toBeInTheDocument(),
    );

    const toolbar = screen.getByRole('toolbar', { name: 'Formatting' });
    for (const name of [
      'Bold',
      'Italic',
      'Underline',
      'Highlight',
      'Bullet list',
      'Align left',
      'Align center',
    ]) {
      expect(screen.getByRole('button', { name })).toBeInTheDocument();
      expect(toolbar).toContainElement(screen.getByRole('button', { name }));
    }
  });
});
