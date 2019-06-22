const players = {};
const ARENA_WIDTH = 6400;
const ARENA_HEIGHT = 6400;

const config = {
  type: Phaser.HEADLESS,
  parent: 'phaser-example',
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { y: 0 }
    }
  },
  scene: AuthoritativeScene,
  autoFocus: false
};

const game = new Phaser.Game(config);
window.gameLoaded();
