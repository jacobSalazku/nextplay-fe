'use client';

import { useEffect } from 'react';
import { io } from 'socket.io-client';

type JoinRequestSocketPayload = {
  teamId: string;
  teamCode: string;
  userId: string;
  memberId: string;
  number?: string | null;
  position?: string | null;
  requestedAt: string | Date;
};

type JoinRequestModerationSocketPayload = {
  memberId: string;
  teamId: string;
  status: 'ACTIVE' | 'INACTIVE';
};

type JoinRequestListenerProps = {
  teamId: string;
  accessToken: string;
  onJoinRequest?: (payload: JoinRequestSocketPayload) => void;
  onJoinRequestApproved?: (payload: JoinRequestModerationSocketPayload) => void;
  onJoinRequestRejected?: (payload: JoinRequestModerationSocketPayload) => void;
};

const SOCKET_ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_ENDPOINT!;

export function JoinRequestListener({
  teamId,
  accessToken,
  onJoinRequest,
  onJoinRequestApproved,
  onJoinRequestRejected,
}: JoinRequestListenerProps) {
  useEffect(() => {
    // Create socket connection and send access token in handshake auth.
    const socket = io(SOCKET_ENDPOINT, {
      withCredentials: true,
      auth: { token: accessToken },
    });

    // Subscribe this socket connection to a single team room on the backend.
    const subscribe = () => {
      socket.emit('subscribe-team', { teamId });
    };

    socket.on('connect', subscribe);

    const handleJoinRequest = (payload: JoinRequestSocketPayload) => {
      onJoinRequest?.(payload);
    };

    const handleJoinRequestApproved = (
      payload: JoinRequestModerationSocketPayload,
    ) => {
      onJoinRequestApproved?.(payload);
    };

    const handleJoinRequestRejected = (
      payload: JoinRequestModerationSocketPayload,
    ) => {
      onJoinRequestRejected?.(payload);
    };

    // Handle realtime notifications from backend moderation flow.
    socket.on('join-request', handleJoinRequest);
    socket.on('join-request-approved', handleJoinRequestApproved);
    socket.on('join-request-rejected', handleJoinRequestRejected);

    return () => {
      socket.off('join-request', handleJoinRequest);
      socket.off('join-request-approved', handleJoinRequestApproved);
      socket.off('join-request-rejected', handleJoinRequestRejected);
      // Always disconnect on cleanup to avoid duplicate listeners.
      socket.disconnect();
    };
  }, [
    accessToken,

    onJoinRequest,
    onJoinRequestApproved,
    onJoinRequestRejected,
    teamId,
  ]);

  return null;
}
