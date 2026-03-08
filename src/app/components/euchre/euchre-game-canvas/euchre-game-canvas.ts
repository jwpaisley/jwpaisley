import { Component, ElementRef, OnDestroy, OnInit, ViewChild, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'jwpaisley-euchre-canvas',
  standalone: true,
  templateUrl: './euchre-game-canvas.html',
  styleUrl: './euchre-game-canvas.scss'
})
export class EuchreCanvas implements OnInit, OnDestroy {
  @ViewChild('euchreGameCanvas', { static: true }) gameContainer!: ElementRef;
  private game: any;
  private platformId = inject(PLATFORM_ID);


  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeGame();
    }
  }

  ngOnDestroy() {
    this.game?.destroy(true);
  }

  private async initializeGame() {
    const Phaser = await import('phaser');
    const { EuchreGame } = await import('../euchre-game/euchre-game');

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: this.gameContainer.nativeElement,
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: '100%',
        height: '100%',
      },
      transparent: true,
      scene: [EuchreGame],
      physics: { default: 'arcade' }
    };

    this.game = new Phaser.Game(config);
  }
}