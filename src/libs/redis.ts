import { createClient } from 'redis';

const client = createClient({
  url: process.env.REDIS_URL,
});

client.on('error', (err) => console.error(err));

if(!client.isOpen) {
  client.connect();
}

export {client};
