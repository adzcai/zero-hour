const style = {
  font: '18px monospace',
  fill: '#ffffff',
};

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

    this.loadingText = this.add.text(width / 2, height / 2 - 50, 'Loading...', style)
      .setOrigin(0.5);
    this.percentText = this.add.text(width / 2, height / 2 - 5, '0%', style)
      .setOrigin(0.5);
    this.assetText = this.add.text(width / 2, height / 2 + 50, '', style)
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

      .audio('bgMusic', ['TownTheme.mp3'])
      .image('phaserLogo', 'logo.png')

      .setPath('ui/')
      .image('box', 'grey_box.png')
      .image('checkedBox', 'blue_boxCheckmark.png')

      .setPath('backgrounds/')
      .image('black')
      .image('blue')
      .image('darkPurple')
      .image('purple')

      .setPath('sounds/')
      .audio('laser', 'Laser_Shoot.wav')

      .setPath('particles')
      .image('trace', 'trace_01.png')
      .image('flare', 'spark_05.png')

      .setPath('explosions');

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
        frameRate: 8,
      });
    }

    this.anims.create({
      key: 'laserBlue',
      frames: ['03', '02', '13', '12'].map(num => ({ key: 'spaceshooter', frame: `laserBlue${num}` })),
      frameRate: 8,
      repeat: -1,
    });

    // this.anims.create({
    //   key: 'metaleyes',
    //   frames: this.anims.generateFrameNumbers('face', { start: 0, end: 4 }),
    //   frameRate: 20,
    //   repeat: -1
    // });

    this.registry.set({
      soundOn: true,
      musicOn: true,
      bgMusicPlaying: false,

      ENEMYTYPES: this.textures.get('spaceshooter').getFrameNames().filter(name => name.startsWith('ufo') || name.startsWith('meteor')),
      POWERUPTYPES: this.textures.get('spaceshooter').getFrameNames().filter(name => name.startsWith('powerup'))
    });

    this.time.delayedCall(500, () => {
      this.logo.destroy();
      this.progressBar.destroy();
      this.progressBox.destroy();
      this.loadingText.destroy();
      this.percentText.destroy();
      this.assetText.destroy();

      this.scene.start('ChooseShip');
    });
  }
}
