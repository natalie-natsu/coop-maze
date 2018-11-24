import Phaser from 'phaser';

import getMainSceneClass from './scenes/main';

export default function (inputGame, socket) {
  const width = window.innerWidth;
  const height = window.innerHeight;

  // eslint-disable-next-line no-new
  return new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'phaser-container',
    width,
    height,
    backgroundColor: '#ffffff',
    pixelArt: true,
    scene: getMainSceneClass(inputGame, socket),
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 0 },
      },
    },
  });
}
