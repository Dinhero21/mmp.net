import type { Socket } from 'net';

type Prefix<T extends string> = `${T}${string}`;

export const blockedKeys = [
  // "The mechanics of the internal buffering are
  // an internal implementation detail and may be
  // changed at any time. [...] Use of these
  // undocumented properties is discouraged."
  // - NodeJS Docs
  'readableBuffer',
  'writableBuffer',
] as const;

type BlockedKey = (typeof blockedKeys)[number];

export type SuperSuperDataKey = Prefix<'readable' | 'writable'>;
export type SuperDataKey = Extract<keyof Socket, SuperSuperDataKey>;
export type DataKey = Exclude<SuperDataKey, BlockedKey>;

export type Data = Pick<Socket, DataKey>;

export interface GlobalMessage {
  client: Data;
  server: Data;
}
