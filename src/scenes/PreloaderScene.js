import { defaultFont, resolve, deepSet } from '../objects/Util.js';

const context = require.context('../../assets', true, /\.(jpe?g|png|gif|mp3|wav|ogg|xml)$/);
const files = {};

context.keys().forEach((filename) => {
  files[filename] = context(filename);
});

/**
 * This scene loads all of the necessary assets into our game.
 */
export default class PreloaderScene extends Phaser.Scene {
  constructor() {
    super('Preloader');
  }

  preload() {
    const { width, height } = this.cameras.main;

    // add logo image
    this.logo = this.add.image(width / 2, height / 2, 'logo');

    // display progress bar
    this.progressBar = this.add.graphics().fillStyle(0xffffff, 1);
    this.progressBox = this.add.rectangle(
      width / 2, height / 2,
      width / 2.5, height / 12,
      0x222222, 0.8,
    );

    this.loadingText = this.add.text(width / 2, height / 2 - 50, 'Loading...', defaultFont())
      .setOrigin(0.5);
    this.percentText = this.add.text(width / 2, height / 2 - 5, '0%', defaultFont())
      .setOrigin(0.5);
    this.assetText = this.add.text(width / 2, height / 2 + 50, '', defaultFont())
      .setOrigin(0.5);

    // update progress bar
    this.load.on('progress', (value) => {
      this.percentText.setText(`${parseInt(value * 100, 10)}%`);
      const { x, y } = this.progressBox.getTopLeft();
      this.progressBar.fillRect(
        x + 10, y + 5,
        (this.progressBox.width - 20) * value, this.progressBox.height - 10,
      );
    });

    // update file progress text
    this.load.on('fileprogress', file => this.assetText.setText(`Loading asset: ${file.key}`));

    // load assets needed in our game
    this.load.setBaseURL('assets/')

      .setPath('images/ui')
      .image('box', 'grey_box.png')
      .image('checkedBox', 'blue_boxCheckmark.png')

      .setPath('images/backgrounds')
      .image('black')
      .image('blue')
      .image('darkPurple')
      .image('purple')

      .setPath('images/particles')
      .image('trace', 'trace_01.png')
      .image('flare', 'spark_05.png')

      .setPath('audio')
      .audio('laser', 'Laser_Shoot.wav')
      .audio('laser1', 'sfx_laser1.ogg')
      .audio('laser2', 'sfx_laser2.ogg')
      .audio('lose', 'sfx_lose.ogg')
      .audio('shieldDown', 'sfx_shieldDown.ogg')
      .audio('shieldUp', 'sfx_shieldUp.ogg')
      .audio('powerup', 'sfx_twoTone.ogg')
      .audio('select', 'Blip_Select.wav')
      .audio('explosion', 'Explosion.wav')

      .audio('titleMusic', 'Title Theme.mp3')
      .audio('gameMusic', 'Sunstrider.mp3')
      .audio('victoryMusic', 'All Clear.mp3')

      .setPath('spritesheets')
      .atlasXML('spaceshooter')
      .atlasXML('spaceshooter2')
      .atlasXML('coins')

      .setPath('images/explosions');

    for (let i = 0; i < 9; i += 1) {
      this.load
        .image(`regularExplosion0${i}`)
        .image(`sonicExplosion0${i}`);
    }
  }

  create() {
    for (const explType of ['regular', 'sonic']) { // Create explosion animations
      this.anims.create({
        key: `${explType}Explosion`,
        frames: [...Array(9).keys()].map(i => ({ key: `${explType}Explosion0${i}` })),
        frameRate: 12,
      });
    }

    this.anims.create({
      key: 'sonicExplosionSlow',
      frames: [...Array(9).keys()].map(i => ({ key: `sonicExplosion0${i}` })),
      frameRate: 4,
    });

    const anims = {
      laserBlue01: ['03', '02', '13', '12'],
      laserBlue02: ['05', '04', '15', '14'],
      laserRed01: ['03', '02', '13', '12'],
      laserRed02: ['05', '04', '15', '14'],
      laserGreen01: ['05', '04', '03', '02'],
      laserGreen02: ['09', '08', '07', '06'],
    };

    for (const key of Object.keys(anims)) {
      this.anims.create({
        key,
        frames: anims[key].map(num => ({ key: 'spaceshooter', frame: `${key.slice(0, -2)}${num}` })),
        frameRate: 8,
        repeat: -1,
      });
    }

    const missiles = {
      missileGreen: ['14', '15', '16', '01'],
      missileRed: ['08', '09', '10', '11'],
      missileBlue: ['08', '09', '10', '11'],
    };

    for (const key of Object.keys(missiles)) {
      this.anims.create({
        key,
        frames: this.anims.generateFrameNames('spaceshooter', {
          prefix: `laser${key.slice(7)}`,
          frames: missiles[key],
        }),
        frameRate: 8,
        repeat: -1,
      });
    }

    this.anims.create({
      key: 'goldCoin',
      frames: this.anims.generateFrameNames('coins', {
        prefix: 'coin_',
        frames: [6, 26, 16, 26, 36, 26],
        zeroPad: 2,
      }),
      frameRate: 4,
      repeat: -1,
    });

    this.registry.set(JSON.parse(window.localStorage.getItem('playerSave')) || {
      soundOn: true,
      musicOn: true,

      money: 0,
      level: 1,

      ENEMYTYPES: this.textures.get('spaceshooter').getFrameNames().filter(name => name.startsWith('ufo') || name.startsWith('meteor')),
      POWERUPTYPES: {
        bolt_gold: 'Increase your firing speed!',
        powerupBlue_shield: 'Regain your health!',
        powerupRed_star: 'Scatter your shots!',
        star_bronze: 'Increase your number of shots!',
      },
      // this.textures.get('spaceshooter').getFrameNames().filter(name => name.startsWith('powerup')),

      playerAttack: {
        laser: {
          delay: 200,
          damage: 400,
          speed: 750,
          numShots: 1,
        },

        missile: {
          delay: 500,
          damage: 600,
          speed: 500,
        },

        TYPES: ['Forward', 'Spread', 'All Around'],
        index: 0,
      },

      playerBody: {
        accel: 1000,
        maxHP: 1000,
      },

      upgrades: {
        'Attack Speed': {
          cost: 100,
          variable: 'playerAttack.laser.delay',
          inc: -25,
        },
        'Attack Damage': {
          cost: 100,
          variable: 'playerAttack.laser.damage',
          inc: 100,
        },
        'Number of Attacks': {
          cost: 300,
          variable: 'playerAttack.laser.numShots',
          inc: 1,
        },
        'Missile Speed': {
          cost: 100,
          variable: 'playerAttack.missile.delay',
          inc: -25,
        },
        'Missile Damage': {
          cost: 100,
          variable: 'playerAttack.missile.damage',
          inc: 300,
        },
        'Ship Speed': {
          cost: 100,
          variable: 'playerBody.accel',
          inc: 250,
        },
        'Ship HP': {
          cost: 100,
          variable: 'playerBody.maxHP',
          inc: 500,
        },
      },
    });

    Object.defineProperty(this.registry.values.playerAttack, 'type', {
      get() {
        return this.TYPES[this.index];
      },
      set(val) {
        this.index = Math.max(this.TYPES.indexOf(val), 0);
      },
    });

    for (const key of Object.keys(this.registry.values.upgrades)) {
      Object.defineProperty(this.registry.values.upgrades[key], 'value', {
        get: () => resolve(this.registry.values, this.registry.values.upgrades[key].variable),
        set: val => deepSet(this.registry.values, this.registry.values.upgrades[key].variable, val),
      });
    }

    window.onbeforeunload = () => {
      window.localStorage.setItem('playerSave', JSON.stringify(this.registry.values));
    };

    this.time.delayedCall(500, () => {
      this.logo.destroy();
      this.progressBar.destroy();
      this.progressBox.destroy();
      this.loadingText.destroy();
      this.percentText.destroy();
      this.assetText.destroy();

      this.scene.launch('Background');
      this.scene.start('ChooseShip');
    });
  }
}
