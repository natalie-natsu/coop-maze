import Phaser from 'phaser';

import { settings } from './settings';
import getMainSceneClass from './scenes/main';

export default function (map, socket) {
  // eslint-disable-next-line no-new
  new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'phaser-container',
    width: settings.width,
    height: settings.height,
    backgroundColor: '#ffffff',
    pixelArt: true,
    scene: getMainSceneClass(map, socket),
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 0 },
      },
    },
  });
}
