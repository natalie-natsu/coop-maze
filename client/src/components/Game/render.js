import Phaser from 'phaser';

const TILE_SIZE = 16;
const WALL = '#';

export default function (map) {
  // eslint-disable-next-line no-new
  new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'phaser-container',
    width: 800,
    height: 600,
    scene: {
      preload,
      create,
    },
  });

  function preload() {
    this.load.image('wall', '/assets/images/wall.png');
  }

  function create() {
    map.forEach((row, y) => {
      row.split('').forEach((tile, x) => {
        if (map[y][x] === WALL) {
          this.add.image(x * TILE_SIZE, y * TILE_SIZE, 'wall');
        }
      });
    });
  }
}
