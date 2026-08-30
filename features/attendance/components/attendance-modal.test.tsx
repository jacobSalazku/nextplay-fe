import { api, gqlData } from '../../../test/msw/handlers';
import { server } from '../../../test/msw/server';
import { renderWithClient } from '../../../test/utils';
import useStore from '@/store/store';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import AttendanceModal from './attendance-modal';

vi.mock('@/context/team-context', () => ({
  useTeam: () => ({ routeKey: 'team-1' }),
}));

const member = {
  id: 'm1',
  name: 'Jay Mason',
  attendances: [],
} as never;

const activity = {
  id: 'act-1',
  date: '2026-01-01T19:00:00.000Z',
  attendees: [
    { memberId: 'm1', attendanceStatus: 'ATTENDING', reason: 'ready' },
  ],
};

describe('AttendanceModal', () => {
  afterEach(() => {
    vi.clearAllMocks();
    useStore.setState({ selectedActivity: null, openGameAttendance: false });
  });

  it('submits the pre-selected status and closes the modal', async () => {
    useStore.setState({
      selectedActivity: activity as never,
      openGameAttendance: true,
    });
    const seen = vi.fn();
    server.use(
      api.mutation('SubmitAttendance', ({ variables }) => {
        seen(variables);
        return gqlData({ submitAttendance: { id: 'a1' } });
      }),
    );

    renderWithClient(<AttendanceModal mode="Game" member={member} />);
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() =>
      expect(useStore.getState().openGameAttendance).toBe(false),
    );
    expect(seen).toHaveBeenCalledWith({
      input: {
        routeKey: 'team-1',
        activityId: 'act-1',
        memberId: 'm1',
        attendanceStatus: 'ATTENDING',
        reason: 'ready',
      },
    });
  });
});
