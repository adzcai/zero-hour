import '../assets/styles/home.css'

alert('hi')

let deviceH = window.screen.availHeight;
let deviceW = window.screen.availWidth;

let deviceRW = window.screen.width * window.devicePixelRatio;
let deviceRH = window.screen.height * window.devicePixelRatio

console.log(deviceRW);

console.log(deviceW + ' ' + deviceH);
import Phaser from 'phaser';
//setup scenes
import { Boot } from './scenes/boot'
import { Preloader } from './scenes/preloader'
import { MainMenu } from './scenes/mainMenu'

//levels
import { Lvl_1 } from './levels/lvl1'


let gameConfig = {
  type: Phaser.AUTO,
  parent: 'canvas',
  width: deviceW,
  height: deviceH,
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
    ],
    resize: resize
}


let config = gameConfig;

let game = new Phaser.Game(config);

function resize() {
		var w = window.innerWidth;
		var h = window.innerHeight;
		var scale = Math.min(w / Config.DEFAULT_WIDTH, h / Config.DEFAULT_HEIGHT);

		game.canvas.setAttribute('style',
			' -ms-transform: scale(' + scale + '); -webkit-transform: scale3d(' + scale + ', 1);' +
			' -moz-transform: scale(' + scale + '); -o-transform: scale(' + scale + '); transform: scale(' + scale + ');' +
			' transform-origin: top left;'
		);

		width = w / scale;
		height = h / scale;
		game.resize(width, height);
		game.scene.scenes.forEach(function (scene) {
			scene.cameras.main.setViewport(0, 0, width, height);
		});
	}

window.addEventListener('resize', function (event) {
     console.log("RESIZE EVENT ");
     if(game.isBooted) resize();
     else game.events.once('boot', resize);
}, false);
