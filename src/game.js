import '../assets/styles/home.css'
alert('hi')
import 'phaser'

import Phaser from 'phaser';
//setup scenes
import { Boot } from './scenes/boot'
import { Preloader } from './scenes/preloader'
import { MainMenu } from './scenes/mainMenu'

//levels
import { Lvl_1 } from './levels/lvl1'



const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 0, x: 0 },
        debug: true
      }
    },
    scene: [
      Boot,
      Preloader,
      MainMenu,
      Lvl_1
    ]
};

const game = new Phaser.Game(config);
