import { useCallback, useEffect, useRef, useState } from 'react';
import type { PublicMachineState } from '@pokermon/types/PublicMachineState';
import type { Event } from '@pokermon/types/PokerMachine';

export function App() {
  const wsRef = useRef<WebSocket>();
  const [lastMessage, setLastMessage] = useState<PublicMachineState>();

  const onMessage = useCallback((e: MessageEvent<string>) => {
    setLastMessage(JSON.parse(e.data) as PublicMachineState);
  }, []);

  const sendMessage = useCallback((event: Event) => {
    wsRef.current?.send(JSON.stringify(event));
  }, []);

  useEffect(() => {
    if (wsRef.current) return;

    wsRef.current = new WebSocket('http://localhost:8000/ws');
    wsRef.current.addEventListener('message', onMessage);

    return () => {
      if (wsRef.current?.readyState === 1) {
        wsRef.current.close();
        wsRef.current.removeEventListener('message', onMessage);
      }
    };
  }, [onMessage]);

  if (!lastMessage) return <div>Attente...</div>;

  return (
    <div>
      <pre>{JSON.stringify(lastMessage, null, 2)}</pre>
      {lastMessage.isAdmin && (
        <button
          onClick={sendMessage.bind(undefined, { type: 'start', userId: lastMessage.currentUser })}
          disabled={!lastMessage.canStart}
        >
          Démarrer
        </button>
      )}
    </div>
  );
}
