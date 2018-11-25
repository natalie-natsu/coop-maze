import { Display, Scene } from 'phaser';
import { isEqual } from 'lodash';

import Events from '../../events';
import settings from '../../settings';
import getTileId from './tiles';

export default function (inputGame, socket) {
  function getTileMapData() {
    const { map: inputMap } = inputGame;

    return inputMap.map((row, y) => row.split('').map((current, x) => {
      const top = y > 0 ? inputMap[y - 1][x] : '#';
      const right = x < row.length - 1 ? inputMap[y][x + 1] : '#';
      const bottom = y < inputMap.length - 1 ? inputMap[y + 1][x] : '#';
      const left = x > 0 ? inputMap[y][x - 1] : '#';

      return getTileId(current, [top, right, bottom, left]);
    }));
  }

  return class MainScene extends Scene {
    constructor() {
      super();
      this.map = null;
      this.layers = {};
      this.player = null;
      this.camera = null;
      this.cursors = null;
      this.players = new Map();
      this.mobs = [];

      this.listners = new Map([
        [Events.UPDATE_POSITION, this.onUpdatePosition.bind(this)],
      ]);
    }

    preload() {
      this.load.image('tiles', '/assets/images/tiles.png');

      inputGame.users.forEach((user) => {
        this.load.atlas(`player-${user.id}`, '/assets/images/player.png', '/assets/atlas/player.json');
      });

      inputGame.mobs.forEach((mob) => {
        this.load.image(`mob-${mob.id}`, `/assets/images/mob-${mob.type}.png`);
      });
    }

    create() {
      this.initMap();
      this.initLayers();
      this.initPlayer();
      this.initPlayers();
      this.initMobs();
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
      const player = inputGame.users.find(user => user.id === socket.id);

      this.player = this.physics.add
        .sprite(player.x, player.y, `player-${socket.id}`, 'front')
        .setSize(30, 40)
        .setOffset(0, 24);

      this.player.emittedValues = null;
      this.physics.add.collider(this.player, this.layers.walls);
      this.initPlayerFrames(socket.id);
    }

    initPlayers() {
      inputGame.users.filter(user => user.id !== socket.id).forEach((user) => {
        const player = this.physics.add
          .sprite(user.x, user.y, `player-${user.id}`, 'front')
          .setSize(30, 40)
          .setOffset(0, 24);

        this.initPlayerFrames(user.id);
        this.players.set(user.id, player);
      });
    }

    initPlayerFrames(id) {
      const directions = ['left', 'right', 'front', 'back'];

      directions.forEach((direction) => {
        this.anims.create({
          key: `player-${id}-${direction}-walk`,
          frames: this.anims.generateFrameNames(`player-${id}`, {
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

    initMobs() {
      inputGame.mobs.forEach((mob) => {
        const physicalMob = this.physics.add
          .sprite(mob.x, mob.y, `mob-${mob.id}`)
          .setSize(32, 32)
          .setOffset(0, 24);

        this.mobs.push(physicalMob);
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
      try {
        this.updatePlayer(socket.id, this.player, true);
        this.updatePlayers();
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
        this.game.destroy();
      }
    }

    updatePlayer(id, player, move = false) {
      const prevVelocity = player.body.velocity.clone();

      // Stop any previous movement from the last frame
      player.body.setVelocity(0);

      if (move) {
        this.movePlayer();
        this.emitPosition();
      }

      // Normalize and scale the velocity so that player can't move faster along a diagonal
      player.body.velocity.normalize().scale(settings.playerSpeed);

      // Update the animation last and give left/right animations precedence over up/down animations
      if (this.cursors.left.isDown) {
        player.anims.play(`player-${id}-left-walk`, true);
      } else if (this.cursors.right.isDown) {
        player.anims.play(`player-${id}-right-walk`, true);
      } else if (this.cursors.up.isDown) {
        player.anims.play(`player-${id}-back-walk`, true);
      } else if (this.cursors.down.isDown) {
        player.anims.play(`player-${id}-front-walk`, true);
      } else {
        player.anims.stop();

        // If we were moving, pick and idle frame to use
        if (prevVelocity.x < 0) player.setTexture(`player-${id}`, 'left');
        else if (prevVelocity.x > 0) player.setTexture(`player-${id}`, 'right');
        else if (prevVelocity.y < 0) player.setTexture(`player-${id}`, 'back');
        else if (prevVelocity.y > 0) player.setTexture(`player-${id}`, 'front');
      }
    }

    movePlayer() {
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
    }

    updatePlayers() {
      this.players.forEach((player, id) => {
        this.updatePlayer(id, player);
      });
    }

    emitPosition() {
      const values = {
        x: this.player.x,
        y: this.player.y,
        vx: this.player.body.velocity.x,
        vy: this.player.body.velocity.y,
      };

      if (!isEqual(this.player.emittedValues, values)) {
        socket.emit(Events.MOVE, values);
        this.player.emittedValues = values;
      }
    }

    onUpdatePosition(position) {
      if (this.players.has(position.id)) {
        const player = this.players.get(position.id);
        player.setPosition(position.x, position.y);
        player.body.setVelocity(position.vx, position.vy);
      }
    }
  };
}
