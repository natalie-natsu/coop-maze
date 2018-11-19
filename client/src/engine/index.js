import Phaser from 'phaser';

import getMainSceneClass from './scenes/main';

export default function (map, socket) {
  // eslint-disable-next-line no-new
  const width = window.innerWidth;
  const height = window.innerHeight < 768 ? window.innerHeight - 54 : window.innerHeight - 62;
  new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'phaser-container',
    width,
    height,
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
