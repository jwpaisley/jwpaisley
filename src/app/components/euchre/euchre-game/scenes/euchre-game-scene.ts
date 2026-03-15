import { EuchreAnimationUtility } from "../utils/euchre-animation-util";
import { EuchreCardUtility, EuchreCardData } from "../utils/euchre-card-util";

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
  }

  preload() {
    this.load.image('card-back', 'https://storage.googleapis.com/jwpaisley-game-assets/euchre/standard-card-back.png');
    this.load.spritesheet('cards', 'https://storage.googleapis.com/jwpaisley-game-assets/euchre/standard-card-deck.png', {
      frameWidth: 80,
      frameHeight: 112
    });
  }

  async create() {
    const deck: EuchreCardData[] = EuchreCardUtility.getShuffledDeck();
    console.log(deck);

    await EuchreAnimationUtility.showDeckShuffleAnimation(this);
    await EuchreAnimationUtility.showDealAnimation(this);
  }
}