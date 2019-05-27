import Phaser from 'phaser';
import getCookie from '../shared/getCookie';

// Load files through webpack
import '../../assets/styles/game.css';
import '../../assets/fonts/kenvector_future.ttf';

import BootScene from './scenes/BootScene';
import PreloaderScene from './scenes/PreloaderScene';
import BackgroundScene from './scenes/BackgroundScene';
import ChooseShipScene from './scenes/ChooseShipScene';
import TitleScene from './scenes/TitleScene';
import GameScene from './scenes/GameScene';
import ArenaScene from './scenes/ArenaScene';
import OptionsScene from './scenes/OptionsScene';
import PowerupInfoScene from './scenes/PowerupInfoScene';
import UpgradesScene from './scenes/UpgradesScene';
import LeaderboardScene from './scenes/LeaderboardScene';
import CreditsScene from './scenes/CreditsScene';

// Refresh the user JWT every 10 seconds
setInterval(() => {
  $.ajax({
    type: 'POST',
    url: '/token',
    data: {
      refreshToken: getCookie('refreshJwt'),
    },
    error(xhr) {
      window.alert(JSON.stringify(xhr));
      window.location.replace('/index.html');
    },
  });
}, 10000);

// const deviceH = window.screen.availHeight;
// const deviceW = window.screen.availWidth;
const DEFAULT_WIDTH = 480;
const DEFAULT_HEIGHT = 640;

const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: DEFAULT_WIDTH,
  height: DEFAULT_HEIGHT,
  backgroundColor: 0x0b0e11,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0, x: 0 },
      debug: false,
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [
    BootScene,
    PreloaderScene,
    BackgroundScene,
    ChooseShipScene,
    TitleScene,
    GameScene,
    ArenaScene,
    OptionsScene,
    PowerupInfoScene,
    UpgradesScene,
    LeaderboardScene,
    CreditsScene,
  ],
};

window.addEventListener('load', () => {
  const game = new Phaser.Game(config);

  function resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const scale = Math.min(w / DEFAULT_WIDTH, h / DEFAULT_HEIGHT);

    game.canvas.setAttribute('style', `
      -ms-transform: scale(${scale}); 
      -webkit-transform: scale3d(${scale}, 1);
      -moz-transform: scale(${scale}); -o-transform: scale(${scale}); transform: scale(${scale});
      transform-origin: top left;
    `);

    const width = w / scale;
    const height = h / scale;

    game.scene.getScenes().forEach((scene) => {
      scene.cameras.main.setViewport(0, 0, width, height);
    });
  }

  window.addEventListener('resize', (e) => {
    console.log('resizing');
    if (game.isBooted) resize();
    else game.events.once('boot', resize);
  }, false);
});

// Handling messages sent to the game

const messages = document.getElementById('messages');

window.addEventListener('keydown', (event) => {
  if (event.which === 13) {
    sendMessage();
  }
  if (event.which === 32) {
    if (document.activeElement === inputMessage) {
      inputMessage.value += ' ';
    }
  }
});

function sendMessage() {
  const message = inputMessage.value;
  if (message) {
    inputMessage.value = '';
    $.ajax({
      type: 'POST',
      url: '/submit-chatline',
      data: {
        message,
        refreshToken: getCookie('refreshJwt'),
      },
      error(xhr) {
        console.error(xhr);
      },
    });
  }
}

function addMessageElement(el) {
  messages.append(el);
  messages.lastChild.scrollIntoView();
}

socket.on('newMessage', (data) => {
  const usernameSpan = document.createElement('span');
  const usernameText = document.createTextNode(data.username);
  usernameSpan.className = 'username';
  usernameSpan.appendChild(usernameText);

  const messageBodySpan = document.createElement('span');
  const messageBodyText = document.createTextNode(data.message);
  messageBodySpan.className = 'messageBody';
  messageBodySpan.appendChild(messageBodyText);

  const messageLi = document.createElement('li');
  messageLi.setAttribute('username', data.username);
  messageLi.append(usernameSpan);
  messageLi.append(messageBodySpan);

  addMessageElement(messageLi);
});
