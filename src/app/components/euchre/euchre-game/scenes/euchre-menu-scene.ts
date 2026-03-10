import { CardUtility, CardData } from "../utils/card-util";

const JACKS: CardData[] = [
    { rank: 'J', suit: 'clubs' },
    { rank: 'J', suit: 'hearts' },
    { rank: 'J', suit: 'spades' },
    { rank: 'J', suit: 'diamonds' },
];

const TITLE_TEXT = 'EUCHRE';
const NEW_GAME_TEXT = 'NEW GAME';
const JOIN_GAME_TEXT = 'JOIN GAME';
const TUTORIAL_TEXT = 'TUTORIAL';
const SETTINGS_TEXT = 'SETTINGS';

const TITLE_FADE_IN_DURATION = 500;
const TITLE_FADE_IN_DELAY = 3000;
const MENU_BUTTON_FADE_IN_DURATION = 500;
const MENU_BUTTON_FADE_IN_DELAY = 3500;

const CARD_SPRITE_WIDTH = 80;
const CARD_SPRITE_HEIGHT = 112;
const CARD_ASPECT_RATIO = CARD_SPRITE_WIDTH / CARD_SPRITE_HEIGHT;

const TEXT_COLOR = '#ffffff';

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

    get screenIsPortrait(): boolean {
        return this.scale.width < this.scale.height;
    }

    get centerX(): number {
        return this.scale.width / 2;
    }

    get centerY(): number {
        return this.scale.height / 2;
    }

    get titleY(): number {
        return this.scale.height * 0.2;
    }

    get buttonsY(): number {
        if (this.screenIsPortrait) {
            return this.scale.height * 0.5;
        } else {
            return this.scale.height * 0.575; 
        }
    }

    get buttonMarginY(): number {
        if (this.screenIsPortrait) {
            return this.scale.height * 0.05;
        } else {
            return this.scale.height * 0.075;
        }
    }

    get titleFontSize(): number {
        if (this.screenIsPortrait) {
            return this.scale.width * 0.2;
        } else {
            return this.scale.width * 0.1;
        }
    }

    get newGameButtonFontSize(): number {
        if (this.screenIsPortrait) {
            return this.scale.width * 0.075;
        } else {
            return this.scale.width * 0.0375;
        }
    }

    get defaultButtonFontSize(): number {
        if (this.screenIsPortrait) {
            return this.scale.width * 0.05;
        } else {
            return this.scale.width * 0.025;
        }
    }

    get cardRowX(): number {
        if (this.screenIsPortrait) {
            return this.scale.width * 0.04;
        } else {
            return this.scale.width * 0.25;
        }
    }

    get cardMargin(): number {
        if (this.screenIsPortrait) {
            return this.scale.width * 0.04;
        } else {
            const sideMargins = this.scale.width * 0.25;
            const container = this.scale.width - (sideMargins * 2);
            const totalCardWidth = this.scaledCardWidth * JACKS.length;
            const remainingSpace = container - totalCardWidth;
            return remainingSpace / (JACKS.length - 1);
        }
    }

    get cardRowY(): number {
        if (this.screenIsPortrait) {
            return this.scale.height * 0.35;
        } else {
            return this.scale.height * 0.4;  
        }
    }

    get scaledCardWidth(): number {
        if (this.screenIsPortrait) {
            return this.scale.width * 0.2;
        } else {
            return this.scaledCardHeight * CARD_ASPECT_RATIO;
        }
    }

    get scaledCardHeight(): number {
        if (this.screenIsPortrait) {
            return this.scaledCardWidth / CARD_ASPECT_RATIO;
        } else {
            return this.scale.height * 0.2;
        }
    }

    get cardScaleFactor(): number {
        if (this.screenIsPortrait) {
            return this.scaledCardWidth / CARD_SPRITE_WIDTH;
        } else {
            return this.scaledCardHeight / CARD_SPRITE_HEIGHT;
        }
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

        this.scale.on('resize', () => this.scene.restart(), this);
    }

    addGameTitle() {
        this.title = this.add.text(this.centerX, this.titleY, TITLE_TEXT, { 
            fontSize: `${this.titleFontSize}px`,
            color: TEXT_COLOR,
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
        this.newGameButton = this.add.text(this.centerX, this.buttonsY, NEW_GAME_TEXT, { 
            fontSize: `${this.newGameButtonFontSize}px`, color: TEXT_COLOR, fontStyle: 'bold'
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => this.createNewGame())
        .setAlpha(0);

        this.joinGameButton = this.add.text(this.centerX, this.buttonsY + this.buttonMarginY, JOIN_GAME_TEXT, { 
            fontSize: `${this.defaultButtonFontSize}px`, color: TEXT_COLOR, fontStyle: 'bold'
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => {})
        .setAlpha(0);

        this.tutorialButton = this.add.text(this.centerX, this.buttonsY + (this.buttonMarginY * 2), TUTORIAL_TEXT, { 
            fontSize: `${this.defaultButtonFontSize}px`, color: TEXT_COLOR, fontStyle: 'bold'
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => {})
        .setAlpha(0);

        this.settingsButton = this.add.text(this.centerX, this.buttonsY + (this.buttonMarginY * 3), SETTINGS_TEXT, { 
            fontSize: `${this.defaultButtonFontSize}px`, color: TEXT_COLOR, fontStyle: 'bold'
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
            const cardRowLeftMargin = this.cardRowX;
            const cardMidpoint= this.scaledCardWidth / 2;
            const cardLeftMargin = (index * this.scaledCardWidth) + (index * this.cardMargin);
            const cardXPosition = cardRowLeftMargin + cardLeftMargin + cardMidpoint;
            
            const card = this.add.sprite(cardXPosition, this.cardRowY, 'card-back');
            card.setScale(this.cardScaleFactor);
            card.setData('cardFace', CardUtility.getFrame(jackData));

            this.cardSprites.push(card);
        });
    }

    createNewGame() {
        const newId = Math.random().toString(36).substring(7);
        this.game.events.emit('CREATE_NEW_GAME', newId);
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
                        scaleX: this.cardScaleFactor,
                        duration: 250,
                        ease: 'Linear'
                    }
                }
            ]);

            timeline.play();
        });
    }
}