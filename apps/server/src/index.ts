import Fastify from 'fastify';
import FastifyWebsocket from '@fastify/websocket';
import { createActor } from 'xstate';
import { pokerMachine } from './machines/pokerMachine.js';
import type { PublicMachineState } from '@pokermon/types/PublicMachineState';
import type { Event } from '@pokermon/types/PokerMachine';

const poker = createActor(pokerMachine);
poker.subscribe(({ context, value }) => {
  for (const user of context.users) {
    user.socket.send(
      JSON.stringify({
        users: context.users.map((u) => u.uuid),
        admin: context.admin ?? '',
        canStart: poker.getSnapshot().can({ type: 'start', userId: user.uuid }),
        isAdmin: user.uuid === context.admin,
        currentUser: user.uuid,
        state: value,
      } satisfies PublicMachineState),
    );
  }
  console.log(context, value);
});
poker.start();

const fastify = Fastify();
await fastify.register(FastifyWebsocket);

fastify.get('/', () => {
  return { hello: 'world' };
});

fastify.get('/ws', { websocket: true }, (socket) => {
  const uuid = crypto.randomUUID();
  poker.send({ type: 'join', user: { socket, uuid } });

  socket.on('message', (message) => {
    const event = JSON.parse(message.toLocaleString()) as Event;
    poker.send(event);
  });

  socket.on('close', () => {
    console.log(`${uuid} leave`);
    poker.send({ type: 'leave', userId: uuid });
  });
});

await fastify.listen({ port: 8000, host: '127.0.0.1' });
console.info('Listening on 8000');
