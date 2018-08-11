export class MainMenu extends Phaser.Scene{
  constructor (){
    super({ key: 'mainMenu'});
  }
  create(){
    let menubg = this.add.image(400, 300, 'BkGrnd');
    let welcomeText = this.add.text(200, 200, "- To start the game hit SPACEBAR -", {
        font: "25px Arial",
        fill: "#ff0044",
        align: "center"
    });

    this.input.keyboard.on('keydown_SPACE', function (event) {
      this.scene.start('lvl_1');
    }, this)
  }
}
