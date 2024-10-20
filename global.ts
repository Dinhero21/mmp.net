import { Socket } from 'net';

import type Instance from '../../instance/index.js';
import {
  blockedKeys,
  type Data,
  type DataKey,
  type GlobalMessage,
} from './shared.js';

function* getPrototypeChain(object: object): Iterable<object> {
  while (true) {
    yield object;

    object = Object.getPrototypeOf(object);

    if (object === null) break;
  }
}

function getAllPropertyNames(object: object): string[] {
  const propertyNames = new Set<string>();

  for (const prototype of getPrototypeChain(object)) {
    const keys = Object.getOwnPropertyNames(prototype);

    for (const key of keys) {
      propertyNames.add(key);
    }
  }

  return [...propertyNames];
}

// for whatever reason, DataKeys are neither enumerable NOR stored within Socket.prototype
const socketKeys = getAllPropertyNames(Socket.prototype) as (keyof Socket &
  string)[];

const keys = socketKeys
  .filter((key) => key.startsWith('readable') || key.startsWith('writable'))
  .filter(
    (key) => !(blockedKeys as readonly string[]).includes(key),
  ) as DataKey[];

export default async function (instance: Instance): Promise<void> {
  const channel = instance.createChannel<GlobalMessage, never>('dinhero21.net');

  // ? when (how often) should I send these messages
  setInterval(() => {
    const data = {
      client: getData(instance.client.socket),
      server: getData(instance.server.socket),
    };

    channel.write(data);
  }, 1000 / 12);

  function getData(socket: Socket): Data {
    const entries = keys.map((key) => [key, socket[key]]);

    return Object.fromEntries(entries) as Data;
  }
}
