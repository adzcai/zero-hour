class Player {
  constructor(playerAttack, playerBody, playerId) {
    // TODO: fix hardcoded values
    this.x = randomPosition(480);
    this.y = randomPosition(640);
    this.rotation = Math.floor(Math.random() * 2 * Math.PI); // a random angle
    this.playerId = playerId;
    this.playerAttack = playerAttack;
    this.playerBody = playerBody;
    this.input = {
      left: false,
      right: false,
      up: false,
      down: false,
      space: false,
      enter: false,
    };
  }
}
