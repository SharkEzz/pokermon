import { setup } from 'xstate';

interface Input {
  admin: number;
}

interface Context {
  users: number[];
  admin: number;
}

type Event =
  | { type: 'join'; user: number }
  | { type: 'start' }
  | { type: 'card.select'; user: number; cardIndex: number }
  | { type: 'reveal' }
  | { type: 'reset' };

export const pokerMachine = setup({
  types: {
    input: {} as Input,
    context: {} as Context,
    events: {} as Event,
  },
  guards: {
    canStart: ({ context }) => {
      return context.users.length > 1;
    },
  },
}).createMachine({
  context: ({ input }) => ({
    users: [],
    admin: input.admin,
  }),
  id: 'Poker',
  initial: 'Lobby',
  states: {
    Lobby: {
      on: {
        join: {
          target: 'Lobby',
        },
        start: {
          target: 'Waiting',
          guard: {
            type: 'canStart',
          },
        },
      },
    },
    Waiting: {
      on: {
        'card.select': {
          target: 'Waiting',
        },
        reveal: {
          target: 'Revealed',
        },
      },
    },
    Revealed: {
      on: {
        reset: {
          target: 'Waiting',
        },
      },
    },
  },
});
