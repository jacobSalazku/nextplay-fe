import { NewPlaySetup } from '../new-play-setup';
import { api, gqlData } from '@/test/msw/handlers';
import { server } from '@/test/msw/server';
import { renderWithClient } from '@/test/utils';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

const { push } = vi.hoisted(() => ({ push: vi.fn() }));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push, refresh: vi.fn() }),
}));

const formations = [
  {
    id: 'f-5out',
    name: '5-out',
    court: 'half' as const,
    objects: [{ id: 'o1', kind: 'offense', label: '1', x: 50, y: 80 }],
  },
];

afterEach(() => vi.clearAllMocks());

describe('NewPlaySetup', () => {
  it('lists the formations for the selected court plus an empty option', () => {
    // Act
    renderWithClient(
      <NewPlaySetup routeKey="team~1" formations={formations} />,
    );

    // Assert
    expect(screen.getByRole('button', { name: /5-out/ })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /empty court/i }),
    ).toBeInTheDocument();
  });

  it('drops court-specific formations when the court changes', async () => {
    // Arrange
    const user = userEvent.setup();
    renderWithClient(
      <NewPlaySetup routeKey="team~1" formations={formations} />,
    );

    // Act
    await user.click(screen.getByRole('button', { name: 'Full court' }));

    // Assert — 5-out is half-court only
    expect(
      screen.queryByRole('button', { name: /5-out/ }),
    ).not.toBeInTheDocument();
  });

  it('blocks submit until the play has a name', async () => {
    // Arrange
    const user = userEvent.setup();
    renderWithClient(
      <NewPlaySetup routeKey="team~1" formations={formations} />,
    );

    // Act
    await user.click(screen.getByRole('button', { name: 'Offense' }));
    await user.click(screen.getByRole('button', { name: 'Create play' }));

    // Assert
    expect(await screen.findByText('Give the play a name')).toBeInTheDocument();
    expect(push).not.toHaveBeenCalled();
  });

  it('creates the play with a seeded diagram and opens the editor', async () => {
    // Arrange
    const user = userEvent.setup();
    const seen = vi.fn();
    server.use(
      api.mutation('CreatePlay', ({ variables }) => {
        seen(variables.input);
        return gqlData({ createPlay: { id: 'play-9' } });
      }),
    );
    renderWithClient(
      <NewPlaySetup routeKey="team~1" formations={formations} />,
    );

    // Act
    await user.type(screen.getByLabelText('Name'), 'Horns flare');
    await user.click(screen.getByRole('button', { name: 'Offense' }));
    await user.click(screen.getByRole('button', { name: /5-out/ }));
    await user.click(screen.getByRole('button', { name: 'Create play' }));

    // Assert
    await waitFor(() =>
      expect(push).toHaveBeenCalledWith(
        '/team/team~1/playbook/play/play-9/edit',
      ),
    );
    expect(seen).toHaveBeenCalledWith(
      expect.objectContaining({
        routeKey: 'team~1',
        name: 'Horns flare',
        description: '',
        category: 'OFFENSIVE',
        diagram: expect.objectContaining({
          version: 1,
          court: 'half',
          phases: [expect.objectContaining({ objects: formations[0].objects })],
        }),
      }),
    );
  });
});
