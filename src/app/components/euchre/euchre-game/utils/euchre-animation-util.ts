import { EuchreCardUtility, EuchreCardData } from './euchre-card-util';
import { EuchreDealerChipUtility } from './euchre-dealer-chip-util';
import Phaser from 'phaser';

export class EuchreAnimationUtility {
    static async showDealerChipPassAnimation(
        scene: Phaser.Scene, 
        direction: 'top' | 'right' | 'bottom' | 'left'
    ): Promise<void> {
        const { width, height } = scene.scale;
        const centerX = width / 2;
        const centerY = height / 2;
        
        // Match the scale logic used for the cards for consistency
        const chipScale = EuchreDealerChipUtility.getDealerChipScaleFromWidth(scene);
        
        // Map the direction string to our target coordinates
        const directionMap = EuchreDealerChipUtility.getDirectionCoordinates(scene);

        const targetPos = directionMap[direction];

        // Create the chip sprite centered and invisible
        const chip = scene.add.sprite(centerX, centerY, 'dealer-chip')
            .setScale(chipScale * 2) // Start slightly larger for the "focal" effect
            .setAlpha(0)
            .setDepth(1000);

        await new Promise<void>(resolve => {
            const timeline = scene.add.timeline([
                {
                    at: 0,
                    tween: {
                        targets: chip,
                        alpha: 1,
                        scale: chipScale,
                        duration: 500,
                        ease: 'Back.easeOut'
                    }
                },
                {
                    at: 800, // Brief pause to show the chip centered
                    tween: {
                        targets: chip,
                        x: targetPos.x,
                        y: targetPos.y,
                        scale: chipScale * 0.8, // Scale down slightly at the player position
                        duration: 600,
                        ease: 'Cubic.easeInOut',
                        onComplete: () => resolve()
                    }
                }
            ]);
            
            timeline.play();
        });
    }

    static async showDeckShuffleAnimation(scene: Phaser.Scene): Promise<void> {
        const { width, height } = scene.scale;
        const centerX = width / 2;
        const centerY = height / 2;
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
        const cardsPerPlayer = 5;
        const players = 4;
        const totalCards = cardsPerPlayer * players;

        const targets = [
            { x: centerX, y: -height * 0.2, angle: 360 },
            { x: width * 1.2, y: centerY, angle: 360 },
            { x: centerX, y: height * 1.2, angle: 360 },
            { x: -width * 0.2, y: centerY, angle: -360 }
        ];

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

    static async showHandRevealAnimation(scene: Phaser.Scene, hand: EuchreCardData[]): Promise<void> {
        return;
    }

    static async showProposalAnimation(scene: Phaser.Scene, proposedCard: EuchreCardData): Promise<void> {
        const { width, height } = scene.scale;
        const centerX = width / 2;
        const centerY = height / 2;
        const cardScale = EuchreCardUtility.getCardScaleFromWidth(scene);
        const texture = EuchreCardUtility.getFrame(proposedCard);
        const slideOffset = width * 0.15;

        // Create the card sprite (initially showing the back)
        const card = scene.add.sprite(centerX, centerY, 'card-back')
            .setScale(cardScale)
            .setDepth(500);

        card.setData('cardFace', EuchreCardUtility.getFrame(proposedCard));

        await new Promise<void>(resolve => {
            const timeline = scene.add.timeline([
                {
                    at: 0,
                    tween: {
                        targets: card,
                        x: centerX + slideOffset,
                        duration: 400,
                        ease: 'Cubic.easeOut'
                    }
                },
                {
                    at: 450, // The Flip: Scale X to 0 to simulate edge-on view
                    tween: {
                        targets: card,
                        scaleX: 0,
                        duration: 150,
                        ease: 'Linear',
                        onComplete: () => {
                            // Swap texture to the front of the card
                            card.setTexture('cards', card.getData('cardFace'));
                        }
                    }
                },
                {
                    at: 600, // Finish Flip: Scale X back to original scale
                    tween: {
                        targets: card,
                        scaleX: cardScale,
                        duration: 150,
                        ease: 'Linear'
                    }
                },
                {
                    at: 850, // Move back to cover the blind
                    tween: {
                        targets: card,
                        x: centerX,
                        duration: 400,
                        ease: 'Cubic.easeInOut',
                        onComplete: () => resolve()
                    }
                }
            ]);

            timeline.play();
        });
    }
}