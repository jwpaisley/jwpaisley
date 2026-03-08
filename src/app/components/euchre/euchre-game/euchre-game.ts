export class EuchreGame extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  preload() {
    this.load.image('card-back', 'https://storage.googleapis.com/jwpaisley-game-assets/euchre/card-back.png');
    this.load.spritesheet('cards', 'https://storage.googleapis.com/jwpaisley-game-assets/euchre/card-deck.png', {
      frameWidth: 80,
      frameHeight: 112
    });
  }

  create() {
    const { width, height } = this.scale;
    const card = this.add.image(width / 2, height / 2, 'card-back');
    
    this.tweens.add({
      targets: card,
      x: width / 2,
      y: height / 2,
      duration: 500,
      ease: 'Power2'
    });
  }
}