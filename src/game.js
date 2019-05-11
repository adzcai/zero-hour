import '../assets/styles/home.css';
import '../assets/fonts/kenvector_future.ttf';

import Phaser from 'phaser';

import GameScene from './scenes/GameScene.js';
import BootScene from './scenes/BootScene.js';
import PreloaderScene from './scenes/PreloaderScene.js';
import TitleScene from './scenes/TitleScene.js';
import OptionsScene from './scenes/OptionsScene.js';
import CreditsScene from './scenes/CreditsScene.js';
import ChooseShipScene from './scenes/ChooseShipScene.js';
import PowerupInfoScene from './scenes/PowerupInfoScene.js';
import BackgroundScene from './scenes/BackgroundScene.js';
import UpgradesScene from './scenes/UpgradesScene.js';

alert('hi');

const deviceH = window.screen.availHeight;
const deviceW = window.screen.availWidth;

const deviceRW = window.screen.width * window.devicePixelRatio;
const deviceRH = window.screen.height * window.devicePixelRatio;

console.log(deviceRW);
console.log(`${deviceW} ${deviceH}`);

const gameConfig = {
  type: Phaser.AUTO,
  parent: 'canvas',
  width: deviceW,
  height: deviceH,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0, x: 0 },
      debug: true,
    },
  },
  scene: [
    BootScene,
    PreloaderScene,
    BackgroundScene,
    ChooseShipScene,
    TitleScene,
    GameScene,
    OptionsScene,
    UpgradesScene,
    PowerupInfoScene,
    CreditsScene,
  ],
  resize,
};

const config = gameConfig;

const game = new Phaser.Game(config);

function resize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const scale = Math.min(w / Config.DEFAULT_WIDTH, h / Config.DEFAULT_HEIGHT);

  game.canvas.setAttribute('style',
    ` -ms-transform: scale(${scale}); -webkit-transform: scale3d(${scale}, 1);`
			+ ` -moz-transform: scale(${scale}); -o-transform: scale(${scale}); transform: scale(${scale});`
			+ ' transform-origin: top left;');

  width = w / scale;
  height = h / scale;
  game.resize(width, height);
  game.scene.scenes.forEach((scene) => {
    scene.cameras.main.setViewport(0, 0, width, height);
  });
}

window.addEventListener('resize', (event) => {
  console.log('RESIZE EVENT ');
  if (game.isBooted) resize();
  else game.events.once('boot', resize);
}, false);
