import defaultFont from "../../shared/defaultFont";
import Button from '../objects/Button';

export default class ChooseLevelScene extends Phaser.Scene {
  constructor() {
    super('ChooseLevel');
  }

  create() {
    $.ajax({
      type: 'GET',
      url: '/player-data',
      success: (data) => {
        this.highScores = data.highScores || {};
        this.showLevels(data.highestLevel || 1);
      },
      error: (xhr) => {
        console.error(xhr);
      }
    })
  }

  showLevels(highestLevel) {
    const { width, height } = this.cameras.main;

    const numRows = Math.floor(highestLevel / 4) + 1;
    const inc = height / (numRows + 4);

    new Button(this, width / 2, inc, 'Choose Level');

    this.highScore = this.add.text(width / 2, inc * 2, 'Hover over a level to see your highscore!', defaultFont()).setOrigin(0.5);

    for (let i = 0; i < highestLevel; i += 1) {
      this.add.text(
        width * ((i % 4) + 1) / 5,
        inc * (Math.floor(i / 4) + 3),
        i + 1,
        defaultFont()
      ).setInteractive().setName('level');
    }

    new Button(this, width / 2, inc * (numRows + 3), 'Back', 'Options');

    this.input.on('gameobjectover', (pointer, obj) => {
      console.log('over');
      if (obj.name === 'level') {
        obj.setColor('#ffff00');
        this.highScore.setText(`Highscore: ${this.highScores[`level${obj.text}`] || 'none'}`)
      }
    });

    this.input.on('gameobjectout', (pointer, obj) => {
      console.log('out');
      if (obj.name === 'level') obj.setColor('#ffffff');
    })

    this.input.on('gameobjectup', (pointer, obj) => {
      if (obj.name === 'level') this.scene.start('Game', { level: parseInt(obj.text, 10) });
    })
  }
}