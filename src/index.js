import GameScene from "./Scenes/GameScene.js";
import BootScene from "./Scenes/BootScene.js";
import PreloaderScene from "./Scenes/PreloaderScene.js";
import TitleScene from "./Scenes/TitleScene.js";
import OptionsScene from "./Scenes/OptionsScene.js";
import CreditsScene from "./Scenes/CreditsScene.js";
import ChooseShipScene from "./Scenes/ChooseShipScene.js";

const config = {
  type: Phaser.AUTO,
  parent: "game-container",
  width: 480,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 }
    }
  },
  scene: [BootScene, PreloaderScene, ChooseShipScene, TitleScene, OptionsScene, CreditsScene, GameScene]
};

window.onload =() => window.game = new Phaser.Game(config);