export default class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload() {
    this.load.setBaseURL('assets')
      .image('logo')
      .atlasXML('spaceshooter', 'sheet.png', 'sheet.xml');
  }

  create() {
    this.scene.start('Preloader');
  }
}
