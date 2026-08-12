import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ChangeDetectorRef, Component, EventEmitter, Input, Output, inject } from '@angular/core';

export interface WheelOption {
  emoji: string;
  label: string;
  percentage: number;
}

const WHEEL_COLORS = [
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

const WHEEL_COLOR_BY_LABEL: Record<string, string> = {
  '1': '#88a088',
  '5': '#8e9fb0',
  '10': '#f2e37c',
  '25': '#d8a252',
  '50': '#ba6b5d',
  '100': '#683a43',
  '250': '#9ba298',
  '500': '#587180',
  '1000': '#cb834f',
};

@Component({
  selector: 'jwpaisley-wheel',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './wheel.html',
  styleUrl: './wheel.scss',
})
export class Wheel {
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private _options: WheelOption[] = [];
  private shuffledOptions: WheelOption[] = [];
  private rotation = 0;
  private rotationVelocity = 0;
  private targetRotation = 0;
  private lastFrameTime?: number;
  private animationFrameId?: number;
  private slowStopDurationMs = 1500;
  private slowingDown = false;
  isSpinning = false;
  private _canSpin = true;

  @Input()
  get canSpin(): boolean {
    return this._canSpin;
  }

  set canSpin(value: boolean) {
    this._canSpin = value;
  }

  @Output() spinRequested = new EventEmitter<void>();
  @Output() spinningStopped = new EventEmitter<void>();

  @Input()
  set options(value: WheelOption[]) {
    this._options = value;
    this.shuffledOptions = this.buildDisplayOptions(value);
  }

  get options(): WheelOption[] {
    return this._options;
  }

  spin(): void {
    if (!this.canSpin || this.isSpinning) {
      return;
    }

    this.isSpinning = true;
    this.slowingDown = false;
    this.rotationVelocity = 1150;
    this.slowStopDurationMs = 2200;
    this.lastFrameTime = undefined;
    this.startAnimationLoop();
    this.spinRequested.emit();
  }

  stopSpinningForValue(value: number): void {
    if (!this.isSpinning || this.displayOptions.length === 0) {
      return;
    }

    const targetValueString = String(value);
    let accumulatedPercentage = 0;
    let selectedCenterDegrees = 0;

    for (const option of this.displayOptions) {
      const startAngle = accumulatedPercentage * 360;
      const endAngle = (accumulatedPercentage + option.percentage) * 360;
      const centerDegrees = (startAngle + endAngle) / 2;

      if (option.label === targetValueString) {
        selectedCenterDegrees = centerDegrees;
        break;
      }

      accumulatedPercentage += option.percentage;
    }

    const normalizedCurrentRotation = ((this.rotation % 360) + 360) % 360;
    const targetCenterRotation = (360 - selectedCenterDegrees + 360) % 360;
    const deltaToTarget = (targetCenterRotation - normalizedCurrentRotation + 360) % 360;
    const extraTurns = 4;

    this.targetRotation = this.rotation + deltaToTarget + extraTurns * 360;
    if (this.targetRotation <= this.rotation) {
      this.targetRotation = this.rotation + 360;
    }

    const remainingTurnDegrees = Math.max(0, this.targetRotation - this.rotation);
    const extraSlowdownTimeMs =
      this.rotationVelocity > 0 ? (remainingTurnDegrees / this.rotationVelocity) * 1000 : 0;
    this.slowStopDurationMs = Math.max(4000, 2200 + extraSlowdownTimeMs);

    this.slowingDown = true;
    this.lastFrameTime = undefined;
  }

  private startAnimationLoop(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    const tick = (time: number) => {
      if (!this.isSpinning) {
        this.animationFrameId = undefined;
        return;
      }

      if (this.lastFrameTime === undefined) {
        this.lastFrameTime = time;
      }

      const deltaMs = time - this.lastFrameTime;
      this.lastFrameTime = time;

      if (this.slowingDown) {
        const decelerationPerMs = this.rotationVelocity / this.slowStopDurationMs;
        this.rotationVelocity = Math.max(0, this.rotationVelocity - decelerationPerMs * deltaMs);
      }

      this.rotation += (this.rotationVelocity * deltaMs) / 1000;

      if (this.slowingDown && this.rotation >= this.targetRotation) {
        this.rotation = this.targetRotation;
        this.rotationVelocity = 0;
        this.slowingDown = false;
        this.isSpinning = false;
        this.animationFrameId = undefined;
        this.spinningStopped.emit();
        this.changeDetectorRef.markForCheck();
        return;
      }

      if (this.rotationVelocity <= 0.1 && this.slowingDown) {
        this.rotation = this.targetRotation;
        this.rotationVelocity = 0;
        this.slowingDown = false;
        this.isSpinning = false;
        this.animationFrameId = undefined;
        this.spinningStopped.emit();
        this.changeDetectorRef.markForCheck();
        return;
      }

      this.changeDetectorRef.markForCheck();
      this.animationFrameId = requestAnimationFrame(tick);
    };

    this.animationFrameId = requestAnimationFrame(tick);
  }

  private normalizeOptions(options: WheelOption[]): WheelOption[] {
    const total = options.reduce((sum, option) => sum + option.percentage, 0);

    if (!total || options.length === 0) {
      return options;
    }

    return options.map((option) => ({
      ...option,
      percentage: option.percentage / total,
    }));
  }

  private buildDisplayOptions(options: WheelOption[]): WheelOption[] {
    const normalizedOptions = this.normalizeOptions(options);

    if (normalizedOptions.length <= 1) {
      return [...normalizedOptions];
    }

    const shuffled = [...normalizedOptions];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
  }

  get displayOptions(): WheelOption[] {
    return this.shuffledOptions;
  }

  private getColorForOption(option: WheelOption): string {
    return WHEEL_COLOR_BY_LABEL[String(option.label)] ?? WHEEL_COLORS[0];
  }

  get wheelTransform(): string {
    return `rotate(${this.rotation}deg)`;
  }

  get wheelBackground(): string {
    const displayOptions = this.displayOptions;

    if (displayOptions.length === 0) {
      return 'conic-gradient(#f0f0f0 0deg 360deg)';
    }

    let accumulatedPercentage = 0;
    const segments = displayOptions.map((option) => {
      const startAngle = accumulatedPercentage * 360;
      const endAngle = (accumulatedPercentage + option.percentage) * 360;
      const color = this.getColorForOption(option);
      accumulatedPercentage += option.percentage;

      return `${color} ${startAngle}deg ${endAngle}deg`;
    });

    return `conic-gradient(${segments.join(', ')})`;
  }
}
