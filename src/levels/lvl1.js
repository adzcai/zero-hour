export class Lvl_1 extends Phaser.Scene{
  constructor(){
    super('lvl_1')
  }
  create(){
    this.input.keyboard.on('keydown_SPACE', function (event) {
      this.scene.start('mainMenu');
    },this)
  }
  update(){

  }
}
