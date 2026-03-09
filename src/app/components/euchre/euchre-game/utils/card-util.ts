import { shuffle } from '../../../../../utils/shuffle';

export interface CardData {
  rank: string;
  suit: string;
}

export class CardUtility {
    private static readonly SUITS = ['spades', 'diamonds', 'clubs', 'hearts'];
    private static readonly RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

    /**
     * Generates a shuffled Euchre deck of 24 cards (9-A of each suit)
     * @returns An array of CardData objects representing the deck
     */
    static getShuffledDeck(): CardData[] {
        const deck: CardData[] = [];

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
     * Calculates the spritesheet frame index
     * @param card The rank and suit of the card
     * @returns The 0-based index for the Phaser spritesheet
     */
    static getFrame(card: CardData): number {
        const suitIndex = this.SUITS.indexOf(card.suit.toLowerCase());
        const rankIndex = this.RANKS.indexOf(card.rank.toUpperCase());

        if (suitIndex === -1 || rankIndex === -1 || suitIndex >= this.SUITS.length || rankIndex >= this.RANKS.length) {
        console.warn(`invalid card data: ${card.rank} of ${card.suit}`);
        return 0;
        }

        return (suitIndex * 13) + rankIndex;
    }
}