export default class Mob extends Phaser.GameObjects.Sprite {
  constructor(scene, name) {
    super(scene, 0, 0, "spaceshooters", name);
    
    const { width, height } = this.scene.cameras.main;
  }
}