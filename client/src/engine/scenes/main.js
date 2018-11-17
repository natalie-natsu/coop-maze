import { Display, Scene } from 'phaser';

import { settings } from '../settings';

export default function (inputMap) {
  function getTileMapData() {
    const tilesIds = {
      '#': 0,
      ' ': -1,
      '*': -1,
    };

    const result = inputMap.map(row => row.split('').map(input => tilesIds[input]));

    // Temp fix for spawning point ; TODO remove it
    for (let y = 1; y < 10; y += 1) {
      for (let x = 1; x < 10; x += 1) {
        result[y][x] = -1;
      }
    }

    return result;
  }

  return class MainScene extends Scene {
    constructor() {
      super();
      this.map = null;
      this.layers = {};
      this.player = null;
      this.camera = null;
      this.cursors = null;
    }

    preload() {
      this.load.image('tiles', '/assets/images/tiles.png');
      this.load.atlas('player', '/assets/images/player.png', '/assets/atlas/player.json');
    }

    create() {
      this.initMap();
      this.initLayers();
      this.initPlayer();
      this.initCamera();
      this.initKeyboard();

      // Debug
      if (settings.debug) {
        this.initDebug();
      }
    }

    initMap() {
      this.map = this.make.tilemap({
        data: getTileMapData(),
        tileWidth: settings.tileSize,
        tileHeight: settings.tileSize,
      });
    }

    initLayers() {
      const tiles = this.map.addTilesetImage('tiles');
      this.layers.walls = this.map.createStaticLayer(0, tiles, 0, 0);
      this.layers.walls.setCollision(0);
    }

    initPlayer() {
      // TODO: use spawn point ('*' in inputMap?)
      this.player = this.physics.add
        .sprite(5 * settings.tileSize, 5 * settings.tileSize, 'player', 'front')
        .setSize(30, 40)
        .setOffset(0, 24);

      this.physics.add.collider(this.player, this.layers.walls);

      const directions = ['left', 'right', 'front', 'back'];

      directions.forEach((direction) => {
        this.anims.create({
          key: `${direction}-walk`,
          frames: this.anims.generateFrameNames('player', {
            prefix: `${direction}-walk.`,
            start: 0,
            end: 3,
            zeroPad: 3,
          }),
          frameRate: 10,
          repeat: -1,
        });
      });
    }

    initCamera() {
      this.camera = this.cameras.main;
      this.camera.startFollow(this.player);
      this.camera.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    }

    initKeyboard() {
      this.cursors = this.input.keyboard.createCursorKeys();
    }

    initDebug() {
      // Debug collision with walls (displayed in green)
      const debugGraphics = this.add.graphics().setAlpha(0.75);

      this.layers.walls.renderDebug(debugGraphics, {
        tileColor: null,
        collidingTileColor: new Display.Color(0, 255, 0, 128),
        faceColor: new Display.Color(0, 255, 0, 255),
      });
    }

    update() {
      this.updatePlayer();
    }

    updatePlayer() {
      const prevVelocity = this.player.body.velocity.clone();

      // Stop any previous movement from the last frame
      this.player.body.setVelocity(0);

      // Horizontal movement
      if (this.cursors.left.isDown) {
        this.player.body.setVelocityX(-settings.playerSpeed);
      } else if (this.cursors.right.isDown) {
        this.player.body.setVelocityX(settings.playerSpeed);
      }

      // Vertical movement
      if (this.cursors.up.isDown) {
        this.player.body.setVelocityY(-settings.playerSpeed);
      } else if (this.cursors.down.isDown) {
        this.player.body.setVelocityY(settings.playerSpeed);
      }

      // Normalize and scale the velocity so that player can't move faster along a diagonal
      this.player.body.velocity.normalize().scale(settings.playerSpeed);

      // Update the animation last and give left/right animations precedence over up/down animations
      if (this.cursors.left.isDown) {
        this.player.anims.play('left-walk', true);
      } else if (this.cursors.right.isDown) {
        this.player.anims.play('right-walk', true);
      } else if (this.cursors.up.isDown) {
        this.player.anims.play('back-walk', true);
      } else if (this.cursors.down.isDown) {
        this.player.anims.play('front-walk', true);
      } else {
        this.player.anims.stop();

        // If we were moving, pick and idle frame to use
        if (prevVelocity.x < 0) this.player.setTexture('atlas', 'left');
        else if (prevVelocity.x > 0) this.player.setTexture('atlas', 'right');
        else if (prevVelocity.y < 0) this.player.setTexture('atlas', 'back');
        else if (prevVelocity.y > 0) this.player.setTexture('atlas', 'front');
      }
    }
  };
}
