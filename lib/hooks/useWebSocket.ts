'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { Socket } from 'socket.io-client';
import { initializeSocket } from '@/lib/api/websocket';
import { usePricesStore } from '@/lib/store/pricesStore';
import { WebSocketPriceUpdate, WebSocketCurrentPrices } from '@/types';
import { toast } from 'sonner';
import { formatPrice } from '@/lib/utils/formatters';

export function useWebSocket() {
  const [connected, setConnected] = useState(false);
  const { updatePrices, updatePrice } = usePricesStore();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    console.log('🔌 Initializing WebSocket connection...');
    socketRef.current = initializeSocket();
    const socket = socketRef.current;

    socket.on('connect', () => {
      setConnected(true);
      console.log('✅ WebSocket connected, ID:', socket.id);
    });

    socket.on('disconnect', () => {
      setConnected(false);
      console.log('❌ WebSocket disconnected');
    });

    socket.on('connect_error', (error) => {
      console.error('❌ WebSocket connection error:', error);
    });

    // Receive current prices when connected
    socket.on('prices:current', (data: WebSocketCurrentPrices) => {
      console.log('📦 Received prices:current:', data);
      if (data.success) {
        console.log(`   └─ Updating ${data.data.length} prices in store`);
        updatePrices(data.data);
      }
    });

    // Receive real-time updates
    socket.on('prices:updated', (data: WebSocketPriceUpdate) => {
      console.log('🔄 Received prices:updated:', {
        allPrices: data.allPrices?.length,
        changes: data.changes?.length,
      });
      if (data.success) {
        updatePrices(data.allPrices);

        // Show notification for changes
        data.changes.forEach((change) => {
          console.log(`   └─ Price changed: ${change.name}`);
          toast.info(`${change.name}: ₫${formatPrice(change.buy)}`, {
            duration: 3000,
          });
        });
      }
    });

    // Subscribe to specific gold types
    socket.on('price:changed', (data: any) => {
      if (data.success) {
        updatePrice(data.data.code, data.data);
      }
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('prices:current');
      socket.off('prices:updated');
      socket.off('price:changed');
    };
  }, [updatePrices, updatePrice]);

  const subscribeTo = useCallback((goldCodes: string[]) => {
    socketRef.current?.emit('subscribe:gold', goldCodes);
  }, []);

  const unsubscribeFrom = useCallback((goldCodes: string[]) => {
    socketRef.current?.emit('unsubscribe:gold', goldCodes);
  }, []);

  const requestPrices = useCallback(() => {
    console.log('📤 Emitting get:prices event...');
    socketRef.current?.emit('get:prices');
  }, []);

  return {
    connected,
    subscribeTo,
    unsubscribeFrom,
    requestPrices,
  };
}
