import { defaultFont } from '../Objects/Font.js';

export default class CreditsScene extends Phaser.Scene {
  constructor() {
    super('Credits');
  }

  create() {
    const { width, height } = this.cameras.main;
    this.creditsText = this.add.text(width / 2, height / 2, 'Credits', defaultFont(32)).setOrigin(0.5);
    this.madeByText = this.add.text(width / 2, height * 1.5, 'Created By: Placeholder', defaultFont(26)).setOrigin(0.5);
    this.zone = this.add.zone(width / 2, height / 2, width, height);

    this.tweens.add({
      targets: this.creditsText,
      y: -100,
      ease: 'Power1',
      duration: 1500,
      delay: 1000,
    });

    this.madeByTween = this.tweens.add({
      targets: this.madeByText,
      y: -100,
      ease: 'Power1',
      duration: 3000,
      delay: 3000,
      onComplete: () => {
        this.scene.start('Title');
      },
    });
  }
}
