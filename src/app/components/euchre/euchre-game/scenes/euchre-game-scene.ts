import { CardUtility, CardData } from "../utils/card-util";

export interface EuchreGameSceneData {
  gameId: string;
}

export class EuchreGameScene extends Phaser.Scene {
  private gameId!: string;

  constructor() {
    super('EuchreGameScene');
  }

  init(data: EuchreGameSceneData) {
    this.gameId = data.gameId;

    console.log(this.gameId);
  }

  preload() {
    this.load.image('card-back', 'https://storage.googleapis.com/jwpaisley-game-assets/euchre/standard-card-back.png');
    this.load.spritesheet('cards', 'https://storage.googleapis.com/jwpaisley-game-assets/euchre/standard-card-deck.png', {
      frameWidth: 80,
      frameHeight: 112
    });
  }

  create() {
    const { width, height } = this.scale;

    const deck: CardData[] = CardUtility.getShuffledDeck();
    console.log(deck);
  }
}