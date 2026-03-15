import { EuchreCardUtility, EuchreCardData } from './euchre-card-util';
import { EuchreGameUtility } from './euchre-game-util';
import Phaser from 'phaser';

export class EuchreAnimationUtility {
    static async showDeckShuffleAnimation(scene: Phaser.Scene): Promise<void> {
        const { width, height } = scene.scale;
        const centerX = width / 2;
        const centerY = height / 2;
        const cardWidthPercentage = EuchreCardUtility.getCardWidthPercentage(scene);
        const cardScale = EuchreCardUtility.getCardScaleFromWidth(scene);
        const step = width * 0.2;

        const cards: Phaser.GameObjects.Sprite[] = [];
        for (let i = 0; i < 4; i++) {
            const card = scene.add.sprite(centerX, centerY, 'card-back')
                .setScale(cardScale)
                .setDepth(i);
            cards.push(card);
        }

        for (let iteration = 0; iteration < 4; iteration++) {
            await new Promise<void>(resolve => {
                const timeline = scene.add.timeline([
                    {
                        at: 0,
                        tween: {
                            targets: cards,
                            x: (target: any, key: string, value: number, index: number) => {
                                const offsets = [-1.5, -0.5, 0.5, 1.5];
                                return centerX + (offsets[index] * step);
                            },
                            duration: 300,
                            ease: 'Cubic.easeOut'
                        }
                    },
                    {
                        at: 350,
                        run: () => {
                            cards.forEach((card, i) => card.setDepth(3 - i));
                        }
                    },
                    {
                        at: 400,
                        tween: {
                            targets: cards,
                            x: centerX,
                            duration: 300,
                            ease: 'Cubic.easeIn',
                            onComplete: () => resolve()
                        }
                    }
                ]);
                timeline.play();
            });
        }
    }

    static async showDealAnimation(scene: Phaser.Scene): Promise<void> {
        const { width, height } = scene.scale;
        const centerX = width / 2;
        const centerY = height / 2;
        const cardScale = EuchreCardUtility.getCardScaleFromWidth(scene);
        
        const dealGroup: Phaser.GameObjects.Sprite[] = [];
        const cardsPerPlayer = 4;
        const players = 4;
        const totalCards = cardsPerPlayer * players;

        // Define exit points for each player index (0: Top, 1: Right, 2: Bottom, 3: Left)
        const targets = [
            { x: centerX, y: -height * 0.2, angle: 360 },    // Top
            { x: width * 1.2, y: centerY, angle: 360 },     // Right
            { x: centerX, y: height * 1.2, angle: 360 },    // Bottom
            { x: -width * 0.2, y: centerY, angle: -360 }    // Left
        ];

        // Create 16 temporary sprites at the deck's center
        for (let i = 0; i < totalCards; i++) {
            const card = scene.add.sprite(centerX, centerY, 'card-back')
                .setScale(cardScale)
                .setDepth(200 + i);
            dealGroup.push(card);
        }

        await new Promise<void>(resolve => {
            scene.tweens.add({
                targets: dealGroup,
                x: (target: any, key: string, value: number, index: number) => {
                    const playerIndex = index % players; // Clockwise logic
                    return targets[playerIndex].x;
                },
                y: (target: any, key: string, value: number, index: number) => {
                    const playerIndex = index % players;
                    return targets[playerIndex].y;
                },
                angle: (target: any, key: string, value: number, index: number) => {
                    const playerIndex = index % players;
                    return targets[playerIndex].angle;
                },
                alpha: 0,
                delay: scene.tweens.stagger(100, {}), // Time between each "toss"
                duration: 600,
                ease: 'Quad.easeIn',
                onComplete: () => {
                    // Clean up the temporary sprites
                    dealGroup.forEach(c => c.destroy());
                    resolve();
                }
            });
        });
    }
}