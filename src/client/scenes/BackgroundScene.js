export default class BackgroundScene extends Phaser.Scene {
  constructor() {
    super('Background');

    this.speed = 1;
    this.colors = ['black', 'blue', 'darkPurple', 'purple'];
  }

  create() {
    const { width, height } = this.cameras.main;
    this.background = this.add.tileSprite(0, 0, width, height, 'black').setOrigin(0);
    this.bgMusic = this.sound.add('titleMusic', { volume: 0.5, loop: true });
    this.bgMusic.play();
  }

  update() {
    this.background.tilePositionY -= this.speed;
    if (this.newBackground) this.newBackground.tilePositionY -= this.speed;
  }

  changeColor(newColor) {
    const { width, height } = this.cameras.main;

    this.tweens.add({
      targets: this.background,
      ease: 'Linear',
      alpha: 0,
    });

    this.newBackground = this.add.tileSprite(0, 0, width, height, newColor).setOrigin(0).setAlpha(0);

    this.tweens.add({
      targets: this.newBackground,
      ease: 'Linear',
      alpha: 1,
      onComplete: () => {
        this.background.destroy();
        this.newBackground.destroy();
        this.background = this.add.tileSprite(0, 0, width, height, newColor).setOrigin(0);
      },
    });

    return this;
  }

  changeSpeed(newSpeed) {
    this.tweens.addCounter({
      from: this.speed,
      to: newSpeed,
      ease: 'Linear',
      duration: 1000,
      onUpdate: (t) => {
        this.speed = t.getValue();
      },
    });

    return this;
  }

  playBgMusic(key) {
    this.bgMusic.destroy();
    this.bgMusic = this.sound.add(key, { volume: 0.5, loop: true });
    this.bgMusic.play();
  }
}
