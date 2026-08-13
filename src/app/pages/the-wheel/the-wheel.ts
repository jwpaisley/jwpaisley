import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, ViewChild, inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { Card } from '../../components/card/card';
import { KeyValueList } from '../../components/key-value-list/key-value-list';
import { Message } from '../../components/message/message';
import { Loader } from '../../components/loader/loader';
import { Wheel, WheelOption } from '../../components/wheel/wheel';
import { ToastService } from '../../services/toast-service/toast-service';
import { UserService } from '../../services/user-service/user-service';
import { DialogService } from '../../services/dialog-service/dialog-service';
import { WheelService } from '../../services/wheel-service/wheel-service';

@Component({
  selector: 'jwpaisley-the-wheel-page',
  standalone: true,
  imports: [CommonModule, Wheel, Card, KeyValueList, Message, Loader],
  templateUrl: './the-wheel.html',
  styleUrl: './the-wheel.scss',
})
export class TheWheelPage implements OnInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly wheelService = inject(WheelService);
  private readonly toastService = inject(ToastService);
  private readonly userService = inject(UserService);
  private readonly dialogService = inject(DialogService);
  private cooldownInterval?: ReturnType<typeof setInterval>;

  @ViewChild(Wheel) private wheelComponent?: Wheel;

  wheelOptions: WheelOption[] = [];
  canSpin = false;
  isSpinning = false;
  isWheelLoading = true;
  isLoggedIn = false;
  spinCountdownMessage = '';
  private lastWheelCoinsWon = 0;
  private lastSpinAt: Date | null = null;
  private forceLockedUntilReload = false;

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.isLoggedIn = !!this.userService.getUserInfoFromLocalStorage();
    this.loadWheelOptions();
    this.loadSpinEligibility();
    this.startCooldownTimer();
  }

  ngOnDestroy(): void {
    if (this.cooldownInterval) {
      clearInterval(this.cooldownInterval);
    }
  }

  get wheelOptionMap() {
    const total = this.wheelOptions.reduce((sum, option) => sum + option.percentage, 0);
    const normalizedOptions = total
      ? this.wheelOptions.map((option) => ({
          ...option,
          percentage: option.percentage / total,
        }))
      : this.wheelOptions;

    return normalizedOptions.map((option) => ({
      key: `${option.emoji} ${option.label}`,
      value: `${(option.percentage * 100).toFixed(0)}%`,
      color: this.getWheelColor(option.label),
    }));
  }

  spinWheel(): void {
    if (!this.canSpin || this.isSpinning || this.wheelOptions.length === 0) {
      return;
    }

    this.canSpin = false;
    this.forceLockedUntilReload = true;
    this.isSpinning = true;
    this.lastWheelCoinsWon = 0;
    this.wheelComponent?.spin();

    setTimeout(() => {
      this.wheelService.spinWheel().subscribe({
        next: (response) => {
          const awardedCoins = response.coinsAwarded ?? response.outcome ?? 0;
          this.lastWheelCoinsWon = awardedCoins;

          this.canSpin = false;
          this.loadSpinEligibility();
          this.wheelComponent?.stopSpinningForValue(
            response.wheelOption?.value ?? response.outcome ?? 0,
          );
        },
        error: () => {
          this.isSpinning = false;
        },
      });
    }, 3000);
  }

  showWheelAchievementDialog(): void {
    if (this.lastWheelCoinsWon <= 0) {
      return;
    }

    setTimeout(() => {
      const currentUser = this.userService.getUserInfoFromLocalStorage();
      if (currentUser) {
        const nextBalance = (currentUser.coins ?? 0) + this.lastWheelCoinsWon;
        this.userService.saveUserInfoToLocalStorage({
          ...currentUser,
          coins: nextBalance,
        });
      }

      void this.dialogService.openAchievementDialog({
        title: 'woo!',
        text: `you won 🪙 ${this.lastWheelCoinsWon} from spinning the wheel`,
        emoji: '🎉',
        subtitle: `you won 🪙 ${this.lastWheelCoinsWon} from spinning the wheel`,
        seconds: 5,
        value: {
          emoji: '🎉',
          subtitle: `you won 🪙 ${this.lastWheelCoinsWon} from spinning the wheel`,
          seconds: 5,
        },
      });
    }, 1000);
  }

  private loadWheelOptions(): void {
    this.isWheelLoading = true;

    this.wheelService.getWheelOptions().subscribe({
      next: (options) => {
        this.wheelOptions = [...options]
          .filter((option) => Number.isFinite(option.value) && Number.isFinite(option.probability))
          .sort((a, b) => a.value - b.value)
          .map((option) => ({
            emoji: '🪙',
            label: String(option.value),
            percentage: Number(option.probability),
          }));
        this.isWheelLoading = this.wheelOptions.length === 0;
      },
      error: () => {
        this.wheelOptions = [];
        this.isWheelLoading = false;
        this.toastService.addToast('failed to load wheel options', 'error', 'danger');
      },
    });
  }

  private loadSpinEligibility(): void {
    this.isLoggedIn = !!this.userService.getUserInfoFromLocalStorage();

    if (!this.isLoggedIn) {
      this.canSpin = false;
      this.lastSpinAt = null;
      this.spinCountdownMessage = '';
      return;
    }

    this.wheelService.getCanSpinWheel().subscribe({
      next: (response) => {
        this.lastSpinAt = response.lastSpinAt ? new Date(response.lastSpinAt + (response.lastSpinAt.endsWith('Z') ? '' : 'Z')) : null;

        if (this.forceLockedUntilReload) {
          this.canSpin = false;
          this.updateSpinCountdownMessage();
          return;
        }

        this.canSpin = response.canSpin;
        this.updateSpinCountdownMessage();
      },
      error: () => {
        this.canSpin = false;
        this.lastSpinAt = null;
        this.spinCountdownMessage = '';
      },
    });
  }

  private startCooldownTimer(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (this.cooldownInterval) {
      clearInterval(this.cooldownInterval);
    }

    this.cooldownInterval = setInterval(() => {
      this.updateSpinCountdownMessage();
    }, 1000);
  }

  private updateSpinCountdownMessage(): void {
    if (!this.lastSpinAt) {
      this.spinCountdownMessage = '';
      return;
    }

    const elapsedMs = Date.now() - this.lastSpinAt.getTime();
    const remainingMs = 24 * 60 * 60 * 1000 - elapsedMs;
    const remainingSeconds = Math.max(0, Math.floor(remainingMs / 1000));

    if (remainingSeconds <= 0 || elapsedMs >= 24 * 60 * 60 * 1000) {
      this.lastSpinAt = null;
      this.canSpin = true;
      this.spinCountdownMessage = '';
      return;
    }

    const hours = Math.floor(remainingSeconds / 3600);
    const minutes = Math.floor((remainingSeconds % 3600) / 60);
    const seconds = remainingSeconds % 60;

    let timeText = `${seconds}`;
    if (minutes > 0 || hours > 0) {
      timeText = `${minutes}:${String(seconds).padStart(2, '0')}`;
    }
    if (hours > 0) {
      timeText = `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    this.spinCountdownMessage = `you can spin the wheel again in ${timeText}`;
  }

  private getWheelColor(label: string): string {
    const wheelPalette = [
      '#88a088',
      '#8e9fb0',
      '#f2e37c',
      '#d8a252',
      '#ba6b5d',
      '#683a43',
      '#9ba298',
      '#587180',
      '#cb834f',
    ];

    const indexMap: Record<string, number> = {
      '1': 0,
      '5': 1,
      '10': 2,
      '25': 3,
      '50': 4,
      '100': 5,
      '250': 6,
      '500': 7,
      '1000': 8,
    };

    return wheelPalette[indexMap[label] ?? 0] ?? wheelPalette[0];
  }
}
