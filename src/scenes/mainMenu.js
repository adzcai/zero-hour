export class MainMenu extends Phaser.Scene{
  constructor (){
    super({ key: 'mainMenu'});
  }
  create(){
    let menubg = this.add.image(this.sys.canvas.width / 2, this.sys.canvas.height / 2, 'BkGrnd');
    menubg.setDisplaySize(this.sys.canvas.width, this.sys.canvas.height);

    let welcomeText = this.add.text(200, 200, "- To start the game hit SPACEBAR -", {
        font: "15px Arial",
        fill: "#ff0044",
        align: "center"
    });

    this.input.keyboard.on('keydown_SPACE', function (event) {
      this.scene.start('lvl_1');
    }, this)
  }
}
