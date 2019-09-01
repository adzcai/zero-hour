const config = {
  type: Phaser.HEADLESS,
  parent: 'phaser-example',
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { y: 0 },
    },
  },
  scene: AuthoritativeScene,
  autoFocus: false,
};

function WebGLTexture() { } // Shim to prevent a small bug

const game = new Phaser.Game(config);
window.gameLoaded();
