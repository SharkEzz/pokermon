import { assign, setup } from 'xstate';
import type { Context, Event } from '@pokermon/types/PokerMachine';

export const pokerMachine = setup({
  types: {
    context: {} as Context,
    events: {} as Event,
  },
  guards: {
    canStart: ({ context, event }) => {
      if (event.type !== 'start') return false;

      return context.users.length > 1 && event.userId === context.admin;
    },
  },
  actions: {
    joinPoker: assign(({ context, event }) => {
      if (event.type !== 'join') return { ...context };
      return {
        users: [...context.users, event.user],
        admin: context.users.length === 0 ? event.user.uuid : context.admin,
      };
    }),
    leave: assign(({ context, event }) => {
      if (event.type !== 'leave') return { ...context };

      const newUsers = context.users.filter((u) => u.uuid !== event.userId);

      return {
        users: newUsers,
        admin: context.admin === event.userId ? newUsers[0]?.uuid : context.admin,
      };
    }),
  },
}).createMachine({
  context: {
    users: [],
  },
  id: 'Poker',
  initial: 'Lobby',
  states: {
    Lobby: {
      on: {
        join: {
          target: 'Lobby',
          actions: ['joinPoker'],
        },
        start: {
          target: 'Waiting',
          guard: {
            type: 'canStart',
          },
        },
        leave: {
          target: 'Lobby',
          actions: ['leave'],
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
