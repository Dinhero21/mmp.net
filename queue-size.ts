import { filesize } from 'filesize';

import Bossbar from '../ddg.bossbar/local.js';
import chat from '../ddg.chat/local.js';
import { MessageBuilder } from '../prismarine.chat/local.js';
import { channel } from './local.js';
import { DISPLAY } from './settings.js';

switch (DISPLAY) {
  case 'bossbar':
    const bossbarClientReadable = new Bossbar({
      title: MessageBuilder.fromString('Queue Length (Client Readable)'),
      visible: false,
    });

    const bossbarClientWritable = new Bossbar({
      visible: false,
      title: MessageBuilder.fromString('Queue Length (Client Writable)'),
    });

    const bossbarServerReadable = new Bossbar({
      visible: false,
      title: MessageBuilder.fromString('Queue Length (Server Readable)'),
    });

    const bossbarServerWritable = new Bossbar({
      visible: false,
      title: MessageBuilder.fromString('Queue Length (Server Writable)'),
    });

    channel.subscribe((data) => {
      if (data.client.readableLength === 0) {
        bossbarClientReadable.hide();
      } else {
        bossbarClientReadable.show();

        bossbarClientReadable.health =
          data.client.readableLength / data.client.readableHighWaterMark;
      }

      bossbarClientReadable.color =
        data.client.readableFlowing === null
          ? Bossbar.COLOR.BLUE
          : data.client.readableFlowing
            ? Bossbar.COLOR.GREEN
            : Bossbar.COLOR.RED;

      if (data.client.writableLength === 0) {
        bossbarClientWritable.hide();
      } else {
        bossbarClientWritable.show();

        bossbarClientWritable.health =
          data.client.writableLength / data.client.writableHighWaterMark;
      }

      bossbarClientWritable.color = data.client.writableNeedDrain
        ? Bossbar.COLOR.RED
        : Bossbar.COLOR.GREEN;

      if (data.server.readableLength === 0) {
        bossbarServerReadable.hide();
      } else {
        bossbarServerReadable.show();

        bossbarServerReadable.health =
          data.server.readableLength / data.server.readableHighWaterMark;
      }

      bossbarServerReadable.color =
        data.server.readableFlowing === null
          ? Bossbar.COLOR.BLUE
          : data.server.readableFlowing
            ? Bossbar.COLOR.GREEN
            : Bossbar.COLOR.RED;

      if (data.server.writableLength === 0) {
        bossbarServerWritable.hide();
      } else {
        bossbarServerWritable.show();

        bossbarServerWritable.health =
          data.server.writableLength / data.server.writableHighWaterMark;
      }

      bossbarServerWritable.color = data.server.writableNeedDrain
        ? Bossbar.COLOR.RED
        : Bossbar.COLOR.GREEN;
    });

    break;
  case 'actionbar':
    channel.subscribe((data) => {
      if (data.client.readableLength !== 0) {
        chat.toClientActionBar(
          MessageBuilder.fromString(
            `Queue Length (Client Readable): ${filesize(data.client.readableLength)} / ${filesize(data.client.readableHighWaterMark)}`,
          )
            .setColor(
              data.client.readableFlowing === null
                ? 'blue'
                : data.client.readableFlowing
                  ? 'green'
                  : 'red',
            )
            .toJSON(),
        );
      }

      if (data.client.writableLength !== 0) {
        chat.toClientActionBar(
          MessageBuilder.fromString(
            `Queue Length (Client Writable): ${filesize(data.client.writableLength)} / ${filesize(data.client.writableHighWaterMark)}`,
          )
            .setColor(data.client.writableNeedDrain ? 'red' : 'green')
            .toJSON(),
        );
      }

      if (data.server.readableLength !== 0) {
        chat.toClientActionBar(
          MessageBuilder.fromString(
            `Queue Length (Server Readable): ${filesize(data.server.readableLength)} / ${filesize(data.server.readableHighWaterMark)}`,
          )
            .setColor(
              data.server.readableFlowing === null
                ? 'blue'
                : data.server.readableFlowing
                  ? 'green'
                  : 'red',
            )
            .toJSON(),
        );
      }

      if (data.server.writableLength !== 0) {
        chat.toClientActionBar(
          MessageBuilder.fromString(
            `Queue Length (Server Writable): ${filesize(data.server.writableLength)} / ${filesize(data.server.writableHighWaterMark)}`,
          )
            .setColor(data.server.writableNeedDrain ? 'red' : 'green')
            .toJSON(),
        );
      }
    });

    break;
}
