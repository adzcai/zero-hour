import Button from '../objects/Button';
import defaultFont from '../../shared/defaultFont';

export default class LeaderboardScene extends Phaser.Scene {
  constructor() {
    super('Leaderboard');
  }

  create() {
    $.ajax({
      type: 'GET',
      url: '/scores',
      success: (users) => {
        const { width, height } = this.cameras.main;
        const inc = height / 8;

        const sortedUsers = users.map(user => ({
          name: user.name,
          highScore: Object.values(user.highScores).reduce((a, b) => a + b),
        }));

        this.rank = new Button(this, width / 2, inc, 'Rank');

        for (let i = 1; i <= 5; i += 1) {
          const user = sortedUsers[i - 1];
          if (user) {
            // The following ratios might not always fit users with incredibly long names
            this.add.text(width / 6, inc * (i + 1), i, defaultFont())
              .setOrigin(0.5);
            this.add.text(width / 3, inc * (i + 1), user ? user.name : '---', defaultFont())
              .setOrigin(0, 0.5);
            this.add.text(width * 3 / 4, inc * (i + 1), user ? user.highScore : 0, defaultFont())
              .setOrigin(0, 0.5);
          }
        }

        this.back = new Button(this, width / 2, inc * 7, 'Back', 'Title');
      },
      error: (xhr) => {
        console.error(xhr);
        this.scene.start('Title');
      },
    });
  }
}
