import { defaultFont } from '../objects/Util';

export default class CreditsScene extends Phaser.Scene {
  constructor() {
    super('Credits');
  }

  create() {
    const { width, height } = this.cameras.main;

    this.scene.get('Background').changeColor('black');

    this.creditsText = this.add.text(width / 2, height / 2, 'Credits', defaultFont(32)).setOrigin(0.5);

    const texts = ['Created By: Alexander Cai', 'Assets by: Kenney Vleugels (www.kenney.nl)', 'Audio by: Jonathan So (https://jonathan-so.itch.io/creatorpack)', 'Thank you for playing!'];

    for (let i = 0; i < texts.length; i += 1) {
      const message = this.add.text(width / 2, height * 1.5, texts[i], defaultFont(26, width)).setOrigin(0.5);
      const config = {
        targets: message,
        y: -100,
        ease: 'Linear',
        duration: 5000,
        delay: (i + 1) * 1500,
      };

      if (i === texts.length - 1) config.onComplete = () => this.scene.start('Title');

      this.tweens.add(config);
    }

    this.tweens.add({
      targets: this.creditsText,
      y: -100,
      ease: 'Linear',
      duration: 1500,
      delay: 1000,
    });
  }
}
