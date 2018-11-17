import { Cameras, Scene } from 'phaser';

import { settings } from '../settings';

export default function (inputMap) {
  return class MainScene extends Scene {
    getTileMapData() {
      const tilesIds = {
        '#': 0,
        ' ': -1,
      };

      return inputMap.map(row => row.split('').map(input => tilesIds[input]));
    }

    preload() {
      this.load.image('tiles', '/assets/images/tiles.png');
    }

    create() {
      const map = this.make.tilemap({
        data: this.getTileMapData(),
        tileWidth: settings.tileSize,
        tileHeight: settings.tileSize,
      });

      const tiles = map.addTilesetImage('tiles');
      this.layer = map.createStaticLayer(0, tiles, 0, 0);
      const camera = this.cameras.main;

      // Set up the arrows to control the camera
      const cursors = this.input.keyboard.createCursorKeys();
      this.controls = new Cameras.Controls.FixedKeyControl({
        camera,
        left: cursors.left,
        right: cursors.right,
        up: cursors.up,
        down: cursors.down,
        speed: 0.2,
      });

      camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    }

    update(time, delta) {
      this.controls.update(delta);
    }
  };
}
