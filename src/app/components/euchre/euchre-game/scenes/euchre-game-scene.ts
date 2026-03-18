import { EuchreAnimationUtility } from "../utils/euchre-animation-util";
import { EuchreCardUtility, EuchreCardData, EuchreRoundDeal } from "../utils/euchre-card-util";

export type EuchrePlayerPosition = 'top' | 'right' | 'bottom' | 'left';

export interface EuchreGameSceneData {
  gameId: string;
  score?: EuchreGameScore;
  dealer?: EuchrePlayerPosition;
  currentDeal?: EuchreRoundDeal;
}

export interface EuchreGameScore {
  us: number;
  them: number;
}

export class EuchreGameScene extends Phaser.Scene {
  private gameId!: string;
  private score: EuchreGameScore = { us: 0, them: 0 };
  private currentDeal?: EuchreRoundDeal;
  private dealer: 'top' | 'right' | 'bottom' | 'left' = 'top';

  constructor() {
    super('EuchreGameScene');
  }

  init(data: EuchreGameSceneData) {
    this.gameId = data.gameId;
  }

  preload() {
    this.load.image('dealer-chip', 'https://storage.googleapis.com/jwpaisley-game-assets/euchre/standard-dealer.png');
    this.load.image('card-back', 'https://storage.googleapis.com/jwpaisley-game-assets/euchre/standard-card-back.png');
    this.load.spritesheet('cards', 'https://storage.googleapis.com/jwpaisley-game-assets/euchre/standard-card-deck.png', {
      frameWidth: 80,
      frameHeight: 112
    });
  }

  async create() {
    this.currentDeal = EuchreCardUtility.dealCards(EuchreCardUtility.getShuffledDeck());
    this.dealer = ['top', 'right', 'bottom', 'left'][Math.floor(Math.random() * 4)] as EuchrePlayerPosition;

    console.log('Current Deal:', this.currentDeal);

    await EuchreAnimationUtility.showDealerChipPassAnimation(this, this.dealer);
    await EuchreAnimationUtility.showDeckShuffleAnimation(this);
    await EuchreAnimationUtility.showDealAnimation(this);
    await EuchreAnimationUtility.showHandRevealAnimation(this, this.currentDeal.bottomPlayerHand);
    await EuchreAnimationUtility.showProposalAnimation(this, this.currentDeal.blind[0]);
  }
}