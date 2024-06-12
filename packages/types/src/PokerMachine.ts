interface User {
  socket: { send: (data: string) => void };
  uuid: string;
}

interface Context {
  admin?: string;
  users: User[];
}

type Event =
  | { type: 'join'; user: User }
  | { type: 'leave'; userId: string }
  | { type: 'reset' }
  | { type: 'start'; userId: string }
  | { type: 'reveal' }
  | { type: 'card.select'; userId: string; value: number };

export type { User, Context, Event };
