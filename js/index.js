import GameScene from './Scenes/GameScene.js';
import BootScene from './Scenes/BootScene.js';
import PreloaderScene from './Scenes/PreloaderScene.js';
import TitleScene from './Scenes/TitleScene.js';
import OptionsScene from './Scenes/OptionsScene.js';
import CreditsScene from './Scenes/CreditsScene.js';
import ChooseShipScene from './Scenes/ChooseShipScene.js';
import PowerupInfoScene from './Scenes/PowerupInfoScene.js';
import BackgroundScene from './Scenes/BackgroundScene.js';
import UpgradesScene from './Scenes/UpgradesScene.js';

const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: 480,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      // debug: true,
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
};

window.onload = () => {
  window.game = new Phaser.Game(config);
};
