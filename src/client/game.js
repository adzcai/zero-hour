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
import ChooseLevelScene from './scenes/ChooseLevelScene';
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
const MAX_WIDTH = DEFAULT_WIDTH * 1.5;
const MAX_HEIGHT = DEFAULT_HEIGHT * 1.5;
const SCALE_MODE = 'SMOOTH';

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
    parent: 'game-container',
    mode: Phaser.Scale.NONE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
  },
  scene: [
    BootScene,
    PreloaderScene,
    BackgroundScene,
    ChooseShipScene,
    TitleScene,
    GameScene,
    ArenaScene,
    ChooseLevelScene,
    OptionsScene,
    PowerupInfoScene,
    UpgradesScene,
    LeaderboardScene,
    CreditsScene,
  ],
};

window.addEventListener('load', () => {
  const game = new Phaser.Game(config);

  const resize = () => {
    const div = document.getElementById('game-container');

    const w = div.clientWidth;
    const h = div.clientHeight;

    const scaleMode = SCALE_MODE;

    const scale = Math.min(w / DEFAULT_WIDTH, h / DEFAULT_HEIGHT);
    const newWidth = Math.min(w / scale, MAX_WIDTH);
    const newHeight = Math.min(h / scale, MAX_HEIGHT);

    const defaultRatio = DEFAULT_WIDTH / DEFAULT_HEIGHT;
    const maxRatioWidth = MAX_WIDTH / DEFAULT_HEIGHT;
    const maxRatioHeight = DEFAULT_WIDTH / MAX_HEIGHT;

    // smooth scaling
    let smooth = 1;
    if (scaleMode === 'SMOOTH') {
      const maxSmoothScale = 1.15;
      const normalize = (value, min, max) => (value - min) / (max - min);
      if (DEFAULT_WIDTH / DEFAULT_HEIGHT < w / h) {
        smooth = -normalize(newWidth / newHeight, defaultRatio, maxRatioWidth) / (1 / (maxSmoothScale - 1)) + maxSmoothScale;
      } else {
        smooth = -normalize(newWidth / newHeight, defaultRatio, maxRatioHeight) / (1 / (maxSmoothScale - 1)) + maxSmoothScale;
      }
    }

    // resize the game
    game.scale.resize(newWidth * smooth, newHeight * smooth);

    // scale the width and height of the css
    game.canvas.style.width = `${newWidth * scale}px`;
    game.canvas.style.height = `${newHeight * scale}px`;

    // center the game with css margin
    game.canvas.style.marginTop = `${(h - newHeight * scale) / 2}px`;
    game.canvas.style.marginLeft = `${(w - newWidth * scale) / 2}px`;
  };
  window.addEventListener('resize', (event) => {
    resize();
  });
  resize();
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

function addMessage(data) {
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
}

socket.on('newMessage', addMessage);

// Load existing messages
$.ajax({
  type: 'GET',
  url: '/messages',
  success: (messages) => {
    messages.forEach((msg) => {
      addMessage({
        email: msg.email,
        username: msg.name,
        message: msg.message,
      });
    });
  },
  error: (xhr) => {
    console.error(xhr);
  },
});
