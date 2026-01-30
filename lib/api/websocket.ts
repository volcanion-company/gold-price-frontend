import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function initializeSocket(): Socket {
  if (socket) return socket;

  const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3000';

  socket = io(wsUrl, {
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  socket.on('connect', () => {
    console.log('✅ WebSocket connected:', socket?.id);
  });

  socket.on('disconnect', () => {
    console.log('❌ WebSocket disconnected');
  });

  socket.on('connect_error', (error) => {
    console.error('❌ WebSocket connection error:', error);
  });

  return socket;
}

export function getSocket(): Socket | null {
  return socket;
}

export function closeSocket(): void {
  if (socket) {
    socket.close();
    socket = null;
  }
}
