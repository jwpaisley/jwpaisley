import Phaser from "phaser";

export class EuchreGameUtility {
    static screenIsPortrait(scene: Phaser.Scene): boolean {
        return scene.scale.width < scene.scale.height;
    }
}