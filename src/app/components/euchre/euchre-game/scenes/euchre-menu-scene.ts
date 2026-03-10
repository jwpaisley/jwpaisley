import { CardUtility, CardData } from "../utils/card-util";

const JACKS = [
    { rank: 'J', suit: 'clubs' },
    { rank: 'J', suit: 'hearts' },
    { rank: 'J', suit: 'spades' },
    { rank: 'J', suit: 'diamonds' },
];

const TITLE_FADE_IN_DURATION = 500;
const TITLE_FADE_IN_DELAY = 3000;
const TITLE_Y_MARGIN = -250;
const MENU_BUTTON_FADE_IN_DURATION = 500;
const MENU_BUTTON_FADE_IN_DELAY = 3500;

const CARD_X_MARGIN = 100;
const CARD_Y_MARGIN = 125;

export class EuchreMenuScene extends Phaser.Scene {
    cardSprites: Phaser.GameObjects.Sprite[] = [];
    title?: Phaser.GameObjects.Text = undefined;
    newGameButton?: Phaser.GameObjects.Text = undefined;
    joinGameButton?: Phaser.GameObjects.Text = undefined;
    tutorialButton?: Phaser.GameObjects.Text = undefined;
    settingsButton?: Phaser.GameObjects.Text = undefined;

    constructor() {
        super('EuchreMenuScene');
    }

    get centerX(): number {
        return this.scale.width / 2;
    }

    get centerY(): number {
        return this.scale.height / 2;
    }

    get titleY(): number {
        return this.centerY + TITLE_Y_MARGIN;
    }

    get cardStartX(): number {
        return this.scale.width / 2 - 150;
    }

    get cardY(): number {
        return this.titleY + CARD_Y_MARGIN;
    }

    preload() {
        this.load.image('card-back', 'https://storage.googleapis.com/jwpaisley-game-assets/euchre/standard-card-back.png');
        this.load.spritesheet('cards', 'https://storage.googleapis.com/jwpaisley-game-assets/euchre/standard-card-deck.png', {
            frameWidth: 80,
            frameHeight: 112
        });
    }

    create() {
        this.addJacksToMenuScene();
        this.createFlipSequence();
        this.addGameTitle();
        this.addMenuButtons();
        this.fadeInTitle();
        this.fadeInMenuButtons();
    }

    addGameTitle() {
        this.title = this.add.text(this.scale.width / 2, this.titleY, 'EUCHRE', { 
            fontSize: '64px',
            color: '#fff',
            fontStyle: 'bold'
        })
        .setOrigin(0.5)
        .setAlpha(0);
    }

    fadeInTitle() {
        this.tweens.add({
            targets: this.title,
            alpha: 1,
            duration: TITLE_FADE_IN_DURATION,
            delay: TITLE_FADE_IN_DELAY,
            ease: 'Power2'
        });
    }

    addMenuButtons() {
        this.newGameButton = this.add.text(this.scale.width / 2, this.scale.height / 2, 'NEW GAME', { 
            fontSize: '32px', color: '#fff', fontStyle: 'bold'
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => this.createNewGame())
        .setAlpha(0);

        this.joinGameButton = this.add.text(this.scale.width / 2, this.scale.height / 2 + 50, 'JOIN GAME', { 
            fontSize: '24px', color: '#fff', fontStyle: 'bold'
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => {})
        .setAlpha(0);

        this.tutorialButton = this.add.text(this.scale.width / 2, this.scale.height / 2 + 100, 'TUTORIAL', { 
            fontSize: '24px', color: '#fff', fontStyle: 'bold'
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => {})
        .setAlpha(0);

        this.settingsButton = this.add.text(this.scale.width / 2, this.scale.height / 2 + 150, 'SETTINGS', { 
            fontSize: '24px', color: '#fff', fontStyle: 'bold'
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => {})
        .setAlpha(0);
    }

    fadeInMenuButtons() {
        this.tweens.add({
            targets: [
                this.newGameButton, 
                this.joinGameButton,
                this.tutorialButton, 
                this.settingsButton
            ],
            alpha: 1,
            duration: MENU_BUTTON_FADE_IN_DURATION,
            delay: MENU_BUTTON_FADE_IN_DELAY,
            ease: 'Power2'
        });
    }

    addJacksToMenuScene() {
        this.cardSprites = [];

        JACKS.forEach((jackData, index) => {
            const xPos = this.cardStartX + (index * CARD_X_MARGIN);
            const card = this.add.sprite(xPos, this.cardY, 'card-back');
            card.setScale(1.2);
            card.setData('cardFace', CardUtility.getFrame(jackData));

            this.cardSprites.push(card);
        });
    }

    createNewGame() {
        const newId = Math.random().toString(36).substring(7);
        this.scene.start('EuchreGameScene', { gameId: newId });
    }

    private createFlipSequence() {
        this.cardSprites.forEach((card, index) => {
            const timeline = this.add.timeline([
                {
                    at: index * 500,
                    tween: {
                        targets: card,
                        scaleX: 0,
                        duration: 250,
                        ease: 'Linear',
                        onComplete: () => {
                            card.setTexture('cards', card.getData('cardFace'));
                        }
                    }
                },
                {
                    at: (index * 500) + 250,
                    tween: {
                        targets: card,
                        scaleX: 1.2,
                        duration: 250,
                        ease: 'Linear'
                    }
                }
            ]);

            timeline.play();
        });
    }
}