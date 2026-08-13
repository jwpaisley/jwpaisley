import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'jwpaisley-achievement-dialog',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './achievement-dialog.html',
  styleUrl: './achievement-dialog.scss',
})
export class AchievementDialog implements OnInit, OnDestroy {
  @Input() emoji = '🎉';
  @Input() title = 'woo!';
  @Input() subtitle = 'you won 🪙 0 from spinning the wheel';
  @Input() seconds = 5;

  @Output() close = new EventEmitter<void>();

  private autoCloseTimer?: ReturnType<typeof setTimeout>;

  ngOnInit(): void {
    this.scheduleAutoClose();
  }

  ngOnDestroy(): void {
    this.clearAutoCloseTimer();
  }

  closeDialog(): void {
    this.clearAutoCloseTimer();
    this.close.emit();
  }

  private scheduleAutoClose(): void {
    this.clearAutoCloseTimer();

    const delayMs = Math.max(0, this.seconds * 1000);
    this.autoCloseTimer = setTimeout(() => {
      this.close.emit();
    }, delayMs);
  }

  private clearAutoCloseTimer(): void {
    if (this.autoCloseTimer) {
      clearTimeout(this.autoCloseTimer);
      this.autoCloseTimer = undefined;
    }
  }
}
