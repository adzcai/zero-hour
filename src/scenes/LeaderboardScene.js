import Button from '../objects/Button';
import { defaultFont } from '../objects/Util';

export default class LeaderboardScene extends Phaser.Scene {
  constructor() {
    super('Leaderboard');
  }

  init(data) {
    this.scores = data.scores;
  }

  create() {
    const { width, height } = this.cameras.main;

    const inc = height / 8;

    this.rank = new Button(this, width / 2, inc, 'Rank');

    for (let i = 1; i <= 5; i += 1) {
      const score = this.scores[i - 1];
      if (!score) continue;

      // The following ratios might not always fit users with incredibly long names
      this.add.text(width / 6, inc * (i + 1), i, defaultFont())
        .setOrigin(0.5);
      this.add.text(width / 3, inc * (i + 1), score ? score.name : '---', defaultFont())
        .setOrigin(0, 0.5);
      this.add.text(width * 3 / 4, inc * (i + 1), score ? score.highScore : 0, defaultFont())
        .setOrigin(0, 0.5);
    }

    this.back = new Button(this, width / 2, inc * 7, 'Back', 'Title');
  }
}
