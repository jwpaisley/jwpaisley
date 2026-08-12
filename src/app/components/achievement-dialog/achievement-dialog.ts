import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

@Component({
  selector: 'jwpaisley-achievement-dialog',
  standalone: true,
  imports: [CommonModule],
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
    if (this.autoCloseTimer) {
      clearTimeout(this.autoCloseTimer);
    }
  }

  private scheduleAutoClose(): void {
    if (this.autoCloseTimer) {
      clearTimeout(this.autoCloseTimer);
    }

    const delayMs = Math.max(0, this.seconds * 1000);
    this.autoCloseTimer = setTimeout(() => {
      this.close.emit();
    }, delayMs);
  }
}
