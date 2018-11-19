import { Display, Scene } from 'phaser';

import { Events } from '../../events';
import { settings } from '../../settings';
import getTileId from './tiles';

export default function (inputMap, socket) {
  function getTileMapData() {
    const result = inputMap.map((row, y) => row.split('').map((current, x) => {
      const top = y > 0 ? inputMap[y - 1][x] : '#';
      const right = x < row.length - 1 ? inputMap[y][x + 1] : '#';
      const bottom = y < inputMap.length - 1 ? inputMap[y + 1][x] : '#';
      const left = x > 0 ? inputMap[y][x - 1] : '#';

      return getTileId(current, [top, right, bottom, left]);
    }));

    // Temp fix for spawning point ; TODO remove it
    for (let y = 1; y < 10; y += 1) {
      for (let x = 1; x < 10; x += 1) {
        result[y][x] = 0;
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
      this.objects = new Map();

      this.listners = new Map([
        [Events.UPDATE_POSITION, this.updatePosition],
      ]);
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
      this.initSocket();

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
      this.layers.walls.setCollisionBetween(1, 17);
    }

    initPlayer() {
      // TODO: use spawn point ('*' in inputMap?)
      this.player = this.physics.add
        .sprite(5 * settings.tileSize, 5 * settings.tileSize, 'player', 'front')
        .setSize(30, 40)
        .setOffset(0, 24);

      this.objects.set(socket.id, this.player);
      this.player.emittedX = null;
      this.player.emittedY = null;

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

    initSocket() {
      this.listners.forEach((listener, event) => {
        socket.on(event, listener.bind(this));
      });
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

      this.emitPosition();

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

    emitPosition() {
      if (this.player.emittedX !== this.player.x || this.player.emittedY !== this.player.y) {
        socket.emit(Events.MOVE, this.player.x, this.player.y);
        this.player.emittedX = this.player.x;
        this.player.emittedY = this.player.y;
      }
    }

    updatePosition(position) {
      if (position.id === socket.id) {
        // TODO set player position only if he is too far away from his real position
      } else if (this.objects.has(position.id)) {
        const object = this.objects.get(position.id);

        object.x = position.x;
        object.y = position.y;
      }
    }
  };
}
