import { shuffle } from '../../../../../utils/shuffle';
import { EuchreGameUtility } from './euchre-game-util';

export interface EuchreCardData {
    rank: string;
    suit: string;
}

export interface EuchreRoundDeal {
    topPlayerHand: EuchreCardData[];
    rightPlayerHand: EuchreCardData[];
    bottomPlayerHand: EuchreCardData[];
    leftPlayerHand: EuchreCardData[];
    blind: EuchreCardData[];
}

export class EuchreCardUtility {
    private static readonly SUITS = ['spades', 'diamonds', 'clubs', 'hearts'];
    private static readonly RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

    /**
     * Generates a shuffled Euchre deck of 24 cards (9-A of each suit)
     * @returns An array of CardData objects representing the deck
     */
    static getShuffledDeck(): EuchreCardData[] {
        const deck: EuchreCardData[] = [];

        for (const suit of this.SUITS) {
            deck.push({
                rank: 'A',
                suit
            });

            for (const rank of this.RANKS.slice(8)) {
                deck.push({ rank, suit });
            }
        }

        return shuffle(deck);
    }

    /**
     * Gets the player hands and blind based on the dealer position
     * @param deck The shuffled deck of cards to deal from
     * @param dealer The position of the dealer ('top', 'right', 'bottom', 'left')
     * @returns An object containing the player hands and blind
     */
    static dealCards(deck: EuchreCardData[]): EuchreRoundDeal {
        return {
            topPlayerHand: deck.slice(0, 5),
            rightPlayerHand: deck.slice(5, 10),
            bottomPlayerHand: deck.slice(10, 15),
            leftPlayerHand: deck.slice(15, 20),
            blind: deck.slice(20, 24)
        }
    }

    /**
     * Calculates the spritesheet frame index
     * @param card The rank and suit of the card
     * @returns The 0-based index for the Phaser spritesheet
     */
    static getFrame(card: EuchreCardData): number {
        const suitIndex = this.SUITS.indexOf(card.suit.toLowerCase());
        const rankIndex = this.RANKS.indexOf(card.rank.toUpperCase());

        if (suitIndex === -1 || rankIndex === -1 || suitIndex >= this.SUITS.length || rankIndex >= this.RANKS.length) {
        console.warn(`invalid card data: ${card.rank} of ${card.suit}`);
        return 0;
        }

        return (suitIndex * 13) + rankIndex;
    }

    /**
     * Scales the card sprite to the dimensions of the screen
     * @param width The screen width in pixels
     * @param percentage The screen height in pixels
     * @returns 
     */
    static getCardScaleFromWidth(scene: Phaser.Scene): number {
        const { width } = scene.scale;
        const percentage = this.getCardWidthPercentage(scene);
        const targetWidth = width * percentage;
        const originalWidth = 80; 
    
        return targetWidth / originalWidth;
    }

    /**
     * Provides the percentage scale for the card sprite based on the screen width
     */
    static getCardWidthPercentage(scene: Phaser.Scene): number {
        if (EuchreGameUtility.screenIsPortrait(scene)) {
            return 0.15;
        } else {
            return 0.05;
        }
    }
}