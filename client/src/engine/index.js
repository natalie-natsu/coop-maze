import Phaser from 'phaser';

import { settings } from './settings';
import getMainSceneClass from './scenes/main';

export default function (map) {
  // eslint-disable-next-line no-new
  new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'phaser-container',
    width: settings.width,
    height: settings.height,
    pixelArt: true,
    scene: getMainSceneClass(map),
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 0 },
      },
    },
  });
}
