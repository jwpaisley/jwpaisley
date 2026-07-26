import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, Optional, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Comment } from '../../services/comment-service/comment-service';
import { User, UserService } from '../../services/user-service/user-service';

@Component({
  selector: 'jwpaisley-comment',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './comment.html',
  styleUrl: './comment.scss',
})
export class CommentComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  @Input() comment!: Comment;
  @ViewChild('commentText') private commentTextElement?: ElementRef<HTMLElement>;

  protected userName = 'user';
  protected userImageUrl: string | null = null;
  protected createdAtLabel = '';
  protected updatedAtLabel = '';
  protected isExpanded = false;
  protected showToggle = false;
  protected threeLineHeight = '0px';
  private destroy$ = new Subject<void>();
  private resizeObserver?: ResizeObserver;

  constructor(
    @Optional() private userService: UserService | null,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.createdAtLabel = this.formatTimestamp(this.comment?.createdAt, 'posted');

    if (this.comment?.updatedAt && this.comment.updatedAt !== this.comment.createdAt) {
      this.updatedAtLabel = this.formatTimestamp(this.comment.updatedAt, 'last updated');
    }

    if (this.comment?.user && this.userService) {
      this.userService.getUser(this.comment.user).pipe(takeUntil(this.destroy$)).subscribe({
        next: (user) => {
          this.userName = this.getDisplayName(user);
          this.userImageUrl = user.imageUrl || user.profilePictureUrl || null;
          this.cdr.detectChanges();
        },
        error: () => {
          this.userName = 'user';
          this.cdr.detectChanges();
        },
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['comment']) {
      this.isExpanded = false;
      this.showToggle = false;
      this.updateShowToggle();
    }
  }

  ngAfterViewInit(): void {
    this.observeTextSize();
    this.updateShowToggle();
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected toggleExpanded(): void {
    this.isExpanded = !this.isExpanded;
    this.cdr.detectChanges();
  }

  private observeTextSize(): void {
    const element = this.commentTextElement?.nativeElement;

    if (!element || typeof ResizeObserver === 'undefined') {
      return;
    }

    this.resizeObserver?.disconnect();
    this.resizeObserver = new ResizeObserver(() => {
      this.updateShowToggle();
    });
    this.resizeObserver.observe(element);
  }

  private updateShowToggle(): void {
    const element = this.commentTextElement?.nativeElement;

    if (!element) {
      return;
    }

    if (typeof window === 'undefined' || typeof window.getComputedStyle !== 'function') {
      this.threeLineHeight = '0px';
      this.showToggle = false;
      return;
    }

    const runAfterLayout = typeof window.requestAnimationFrame === 'function'
      ? window.requestAnimationFrame.bind(window)
      : (callback: FrameRequestCallback) => callback(Date.now());

    runAfterLayout(() => {
      const computedStyle = window.getComputedStyle(element);
      const fontSize = parseFloat(computedStyle.fontSize) || 16;
      const lineHeight = parseFloat(computedStyle.lineHeight) || fontSize * 1.45;
      const threeLineHeight = lineHeight * 3;

      this.threeLineHeight = `${threeLineHeight}px`;
      this.showToggle = element.scrollHeight > threeLineHeight + 2;
      this.cdr.detectChanges();
    });
  }

  private getDisplayName(user: User): string {
    const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ').trim();
    return fullName || 'user';
  }

  private formatTimestamp(value: string | undefined, prefix: string): string {
    if (!value) {
      return '';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return '';
    }

    const locale = typeof navigator !== 'undefined' && navigator.language ? navigator.language : 'en-US';
    const month = date.toLocaleDateString(locale, { month: 'long' });
    const day = date.getDate();
    const dayWithSuffix = `${day}${this.getOrdinalSuffix(day)}`;
    const time = date.toLocaleTimeString(locale, { hour: 'numeric', minute: '2-digit', hour12: true })
      .replace(/\s+/g, '')
      .toLowerCase();

    return `${prefix} ${month} ${dayWithSuffix} @ ${time}`;
  }

  private getOrdinalSuffix(day: number): string {
    if (day >= 11 && day <= 13) {
      return 'th';
    }

    const lastDigit = day % 10;
    switch (lastDigit) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  }
}
