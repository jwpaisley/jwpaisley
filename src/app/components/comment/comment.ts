import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, Optional, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Button } from '../button/button';
import { ConfirmationDialog } from '../confirmation-dialog/confirmation-dialog';
import { FormTextArea } from '../form-text-area/form-text-area';
import { CommentInput } from '../comment-input/comment-input';
import { Loader } from '../loader/loader';
import { Comment, CommentService } from '../../services/comment-service/comment-service';
import { ToastService } from '../../services/toast-service/toast-service';
import { UserBasicInfo, UserService } from '../../services/user-service/user-service';

@Component({
  selector: 'jwpaisley-comment',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, Button, ConfirmationDialog, FormTextArea, CommentInput, Loader],
  templateUrl: './comment.html',
  styleUrl: './comment.scss',
})
export class CommentComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  @Input() comment!: Comment;
  @Input() refreshComments?: (newComment?: Comment) => void;
  @Input() showReplyAction = true;
  @Input() userInfo: UserBasicInfo | null = null;
  @ViewChild('commentText') private commentTextElement?: ElementRef<HTMLElement>;
  @ViewChild(CommentInput) private replyInput?: CommentInput;

  protected userName = 'user';
  protected userImageUrl: string | null = null;
  protected isUserLoading = false;
  protected createdAtLabel = '';
  protected updatedAtLabel = '';
  protected isExpanded = false;
  protected showToggle = false;
  protected threeLineHeight = '0px';
  protected isEditing = false;
  protected isDeleting = false;
  protected editDraft = '';
  protected isCurrentUserComment = false;
  protected isReplying = false;
  protected isReplyPosting = false;
  protected replyDraft = '';
  private destroy$ = new Subject<void>();
  private resizeObserver?: ResizeObserver;

  constructor(
    @Optional() protected userService: UserService | null,
    private cdr: ChangeDetectorRef,
    private commentService: CommentService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.createdAtLabel = this.formatTimestamp(this.comment?.createdAt, 'posted');
    this.editDraft = this.comment?.text ?? '';

    if (this.comment?.updatedAt && this.comment.updatedAt !== this.comment.createdAt) {
      this.updatedAtLabel = this.formatTimestamp(this.comment.updatedAt, 'last updated');
    }

    const currentUser = this.userService?.getUserInfoFromLocalStorage();
    this.isCurrentUserComment = Boolean(currentUser?.id) && currentUser?.id === this.comment?.user;
    this.applyUserInfo(this.userInfo);
    this.loadCommentUserInfo();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['comment'] || changes['userInfo']) {
      this.isExpanded = false;
      this.showToggle = false;
      this.isEditing = false;
      this.isDeleting = false;
      this.isReplying = false;
      this.replyDraft = '';
      this.editDraft = this.comment?.text ?? '';
      this.applyUserInfo(this.userInfo);
      this.loadCommentUserInfo();
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

  protected onReplyClick(): void {
    this.isReplying = true;
    this.cdr.detectChanges();
  }

  protected handleReplyPost(commentText: string): void {
    if (!this.comment?.id || !this.comment?.resource || !this.comment?.type) {
      return;
    }

    this.isReplyPosting = true;
    this.cdr.detectChanges();

    this.commentService.createComment({
      resource: this.comment.resource,
      type: this.comment.type,
      text: commentText,
      isReply: true,
      parentComment: this.comment.id,
    }).pipe(takeUntil(this.destroy$)).subscribe({
      next: (createdComment) => {
        this.replyInput?.reset();
        this.isReplyPosting = false;
        this.isReplying = false;
        this.replyDraft = '';
        this.refreshComments?.(createdComment);
        this.toastService.addToast('comment posted', 'comment', 'success');
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(error);
        this.isReplyPosting = false;
        this.toastService.addToast('failed to post comment. please try again later.', 'error', 'danger');
        this.cdr.detectChanges();
      },
    });
  }

  protected onEditClick(): void {
    this.isEditing = true;
    this.editDraft = this.comment?.text ?? '';
    this.cdr.detectChanges();
  }

  protected onCancelEdit(): void {
    this.isEditing = false;
    this.editDraft = this.comment?.text ?? '';
    this.cdr.detectChanges();
  }

  protected onSaveEdit(): void {
    if (!this.comment?.id || !this.editDraft.trim()) {
      return;
    }

    this.commentService.updateComment(this.comment.id, { text: this.editDraft.trim() }).pipe(takeUntil(this.destroy$)).subscribe({
      next: (updatedComment) => {
        this.comment = { ...this.comment, ...updatedComment };
        this.editDraft = updatedComment.text ?? '';
        this.isEditing = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isEditing = false;
        this.cdr.detectChanges();
      },
    });
  }

  protected onDeleteClick(): void {
    this.isDeleting = true;
    this.cdr.detectChanges();
  }

  protected onConfirmDelete(): void {
    if (!this.comment?.id) {
      return;
    }

    this.commentService.deleteComment(this.comment.id).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.comment = { ...this.comment, text: 'deleted comment' };
        this.isCurrentUserComment = false;
        this.isDeleting = false;
        this.toastService.addToast('comment deleted', 'comment', 'success');
        this.cdr.detectChanges();
      },
      error: () => {
        this.isDeleting = false;
        this.toastService.addToast('failed to delete comment. please try again later.', 'error', 'danger');
        this.cdr.detectChanges();
      },
    });
  }

  protected onCancelDelete(): void {
    this.isDeleting = false;
    this.cdr.detectChanges();
  }

  private applyUserInfo(userInfo: UserBasicInfo | null): void {
    if (userInfo) {
      this.userName = this.getDisplayName(userInfo);
      this.userImageUrl = userInfo.profilePictureUrl || null;
      this.isUserLoading = false;
      return;
    }

    if (!this.comment?.user) {
      this.userName = 'user';
      this.userImageUrl = null;
      this.isUserLoading = false;
      return;
    }

    this.userName = 'user';
    this.userImageUrl = null;
    this.isUserLoading = false;
  }

  private loadCommentUserInfo(): void {
    if (!this.comment?.user || !this.userService) {
      return;
    }

    const userId = typeof this.comment.user === 'string' ? this.comment.user : String(this.comment.user);
    this.userService.getUserBasicInfo(userId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (userInfo) => {
        this.userName = this.getDisplayName(userInfo);
        this.userImageUrl = userInfo.profilePictureUrl || null;
        this.isUserLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.userName = 'user';
        this.userImageUrl = null;
        this.isUserLoading = false;
        this.cdr.detectChanges();
      },
    });
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

  private getDisplayName(user: UserBasicInfo | null | undefined): string {
    const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim();
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
