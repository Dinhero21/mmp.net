import Bossbar from '../ddg.bossbar/local.js';
import chat from '../ddg.chat/local.js';
import proxy from '../internal.proxy/local.js';
import { MessageBuilder } from '../prismarine.chat/local.js';
import { DISPLAY } from './settings.js';

// update_time is sent every 1s
const MIN_TIME_S = 1.5;

let lastPacketMS = Date.now();

proxy.downstream.on('update_time', () => {
  lastPacketMS = Date.now();
});

switch (DISPLAY) {
  case 'actionbar':
    setInterval(() => {
      const sinceLastPacketMS = Date.now() - lastPacketMS;
      const sinceLastPacketS = sinceLastPacketMS / 1000;

      if (sinceLastPacketS < MIN_TIME_S) {
        return;
      }

      chat.toClientActionBar({
        text: `Server hasn't responded in ${sinceLastPacketS.toFixed(1)}s`,
        color:
          sinceLastPacketS > 1
            ? sinceLastPacketS > 5
              ? sinceLastPacketS > 10
                ? 'pink'
                : 'red'
              : 'yellow'
            : 'green',
      });
    }, 1000 / 12);
    break;
  case 'bossbar':
    const bossbar = new Bossbar();

    setInterval(() => {
      const sinceLastPacketMS = Date.now() - lastPacketMS;
      const sinceLastPacketS = sinceLastPacketMS / 1000;

      bossbar.health = sinceLastPacketS / 30;
      bossbar.title = MessageBuilder.fromString(
        `Server hasn't responded in ${sinceLastPacketS.toFixed(1)}s`,
      );

      if (sinceLastPacketS < MIN_TIME_S) {
        bossbar.hide();
      } else {
        bossbar.show();
      }

      bossbar.color =
        sinceLastPacketS > 1
          ? sinceLastPacketS > 5
            ? sinceLastPacketS > 10
              ? Bossbar.COLOR.PINK
              : Bossbar.COLOR.RED
            : Bossbar.COLOR.YELLOW
          : Bossbar.COLOR.GREEN;
    }, 1000 / 12);
    break;
}
