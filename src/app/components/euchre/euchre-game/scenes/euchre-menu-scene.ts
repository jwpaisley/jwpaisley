import { CardUtility, CardData } from "../utils/card-util";

export class EuchreMenuScene extends Phaser.Scene {
  constructor() {
    super('EuchreMenuScene');
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
        const centerY = height / 2;
        const startX = width / 2 - 150;
        const titleY = centerY - 250;
        const cardY = titleY + 125;

        // 1. Define the Jacks we want to reveal (Left to Right)
        const jacks = [
            { rank: 'J', suit: 'clubs' },
            { rank: 'J', suit: 'hearts' },
            { rank: 'J', suit: 'spades' },
            { rank: 'J', suit: 'diamonds' },
        ];

        const cardSprites: Phaser.GameObjects.Sprite[] = [];

        // 2. Render the four face-down cards
        jacks.forEach((jackData, index) => {
            const xPos = startX + (index * 100); // Space them out
            const card = this.add.sprite(xPos, cardY, 'card-back');
            card.setScale(1.2); // Make them a bit larger for the menu
            
            // Store the frame index we will flip to
            card.setData('cardFace', CardUtility.getFrame(jackData));
            cardSprites.push(card);
        });

        // 3. Create the sequential flip animation
        this.createFlipSequence(cardSprites);

        // 4. Create the 'EUCHRE' title (initially invisible)
        const title = this.add.text(width / 2, centerY - 250, 'EUCHRE', { 
            fontSize: '64px',
            color: '#fff',
            fontStyle: 'bold'
        })
        .setOrigin(0.5)
        .setAlpha(0);
        
        const newGameButton = this.add.text(width / 2, height / 2, 'NEW GAME', { 
        fontSize: '32px', color: '#fff', fontStyle: 'bold'
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => this.createNewGame())
        .setAlpha(0);

        const joinGameButton = this.add.text(width / 2, height / 2 + 50, 'JOIN GAME', { 
        fontSize: '24px', color: '#fff', fontStyle: 'bold'
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => this.scene.launch('SettingsScene'))
        .setAlpha(0);

        const settingsButton = this.add.text(width / 2, height / 2 + 100, 'SETTINGS', { 
        fontSize: '24px', color: '#fff', fontStyle: 'bold'
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => this.scene.launch('SettingsScene'))
        .setAlpha(0);

        // 5. Fade in the title after the cards are revealed
        this.tweens.add({
            targets: title,
            alpha: 1,
            duration: 500,
            delay: 3500, // Wait for the flip sequence to finish
            ease: 'Power2'
        });

        // 5. Fade in the title after the cards are revealed
        this.tweens.add({
            targets: [newGameButton, joinGameButton, settingsButton],
            alpha: 1,
            duration: 500,
            delay: 4000, // Wait for the flip sequence to finish
            ease: 'Power2'
        });
    }

    createNewGame() {
        const newId = Math.random().toString(36).substring(7);
        this.scene.start('EuchreGameScene', { gameId: newId });
    }

    private createFlipSequence(cards: Phaser.GameObjects.Sprite[]) {
        cards.forEach((card, index) => {
            const timeline = this.add.timeline([
                {
                    at: index * 500, // Stagger the start of each card flip
                    tween: {
                        targets: card,
                        scaleX: 0, // Shrink to a "line"
                        duration: 250,
                        ease: 'Linear',
                        onComplete: () => {
                            // Swap texture to the front face (using our helper frame)
                            card.setTexture('cards', card.getData('cardFace'));
                        }
                    }
                },
                {
                    at: (index * 500) + 250, // Start expanding immediately after shrink
                    tween: {
                        targets: card,
                        scaleX: 1.2, // Expand back to full width
                        duration: 250,
                        ease: 'Linear'
                    }
                }
            ]);

            timeline.play();
        });
    }
}