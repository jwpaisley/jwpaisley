import { EuchreGameUtility } from './euchre-game-util';

export class EuchreDealerChipUtility {
    /**
     * Scales the card sprite to the dimensions of the screen
     * @param scene The Phaser scene to get the screen dimensions from
     * @returns The scale factor to apply to the dealer chip sprite
     */
    static getDealerChipScaleFromWidth(scene: Phaser.Scene): number {
        const { width } = scene.scale;
        const percentage = this.getDealerChipWidthPercentage(scene);
        const targetWidth = width * percentage;
        const originalWidth = 85; 
    
        return targetWidth / originalWidth;
    }

    /**
     * Provides the percentage scale for the card sprite based on the screen width
     * @param scene The Phaser scene to get the screen dimensions from
     * @returns The percentage of the screen width that the dealer chip should occupy
     */
    static getDealerChipWidthPercentage(scene: Phaser.Scene): number {
        if (EuchreGameUtility.screenIsPortrait(scene)) {
            return 0.075;
        } else {
            return 0.025;
        }
    }

    /**
     * Provides the coordinates for the final destination of the dealer chip based on the dealer
     * @param scene The Phaser scene to get the screen dimensions from
     * @returns The coordinates for the final destination of the dealer chip
     */
    static getDirectionCoordinates(scene: Phaser.Scene): Record<string, { x: number, y: number }> {
        const { width, height } = scene.scale;

        const topCoords = { 
            x: width * 0.85,
            y: height * 0.05,
        }

        const rightCoords = {
            x: width * 0.95,
            y: height * 0.3,
        }

        const bottomCoords = {
            x: width * 0.15,
            y: height * 0.95,
        }

        const leftCoords = {
            x: width * 0.05,
            y: height * 0.7,
        }

        return {
            'top': topCoords,
            'right':  rightCoords,
            'bottom': bottomCoords,
            'left':   leftCoords
        }
    }
}