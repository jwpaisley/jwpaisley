import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, Optional } from '@angular/core';
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
export class CommentComponent implements OnInit, OnDestroy {
  @Input() comment!: Comment;

  protected userName = 'user';
  protected userImageUrl: string | null = null;
  protected createdAtLabel = '';
  protected updatedAtLabel = '';
  private destroy$ = new Subject<void>();

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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
