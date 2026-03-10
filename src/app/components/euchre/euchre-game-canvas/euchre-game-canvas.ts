import { Component, ElementRef, OnDestroy, OnInit, ViewChild, inject, PLATFORM_ID, Input} from '@angular/core';
import { isPlatformBrowser, Location} from '@angular/common';
import { Loader } from "../../loader/loader";

@Component({
  selector: 'jwpaisley-euchre-canvas',
  standalone: true,
  imports: [Loader],
  templateUrl: './euchre-game-canvas.html',
  styleUrl: './euchre-game-canvas.scss'
})
export class EuchreCanvas implements OnInit, OnDestroy {
  @Input() id?: string;
  @ViewChild('euchreGameCanvas', { static: true }) gameContainer!: ElementRef;
  private game: any;
  private platformId = inject(PLATFORM_ID);
  private location = inject(Location);
  protected isLoading = true;

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeGame();
      this.isLoading = false;
    }
  }

  ngOnDestroy() {
    if (this.game) {
      this.game.destroy(true);
    }
  }

  private async initializeGame() {
    const phaserModule = await import('phaser');
    const Phaser = (phaserModule as any).default || phaserModule;
    
    const { EuchreMenuScene } = await import('../euchre-game/scenes/euchre-menu-scene');
    const { EuchreGameScene } = await import('../euchre-game/scenes/euchre-game-scene');

    const config: any = {
      type: Phaser.AUTO,
      parent: this.gameContainer.nativeElement,
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: '100%',
        height: '100%',
      },
      transparent: true,
      physics: { default: 'arcade' }
    };

    this.game = new Phaser.Game(config);

    this.game.events.once('ready', () => {
      this.game.scene.add('EuchreMenuScene', EuchreMenuScene, false);
      this.game.scene.add('EuchreGameScene', EuchreGameScene, false);

      if (this.id) {
        this.game.scene.start('EuchreGameScene', { gameId: this.id });
      } else {
        this.game.scene.start('EuchreMenuScene');
      }
    });

    this.game.events.on('CREATE_NEW_GAME', (newId: string) => {
      this.location.go(`/euchre/${newId}`);
    });
  }
}