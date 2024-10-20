import { createChannel } from '../../worker/parent.js';
import type { GlobalMessage } from './shared.js';

export const channel = createChannel<never, GlobalMessage>('dinhero21.net');

// channel.subscribe((data) => {
//   console.log(data);
// });

// you need to use import() to avoid hoisting
// you need to use void (instead of await) to avoid cyclic promise dependency
void import('./lag.js');
void import('./queue-size.js');
