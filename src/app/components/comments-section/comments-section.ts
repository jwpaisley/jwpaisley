import { ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Button } from '../button/button';
import { CommentInput } from '../comment-input/comment-input';
import { CommentComponent } from '../comment/comment';
import { Loader } from '../loader/loader';
import { Comment, CommentResourceType, CommentService } from '../../services/comment-service/comment-service';
import { ToastService } from '../../services/toast-service/toast-service';
import { UserService } from '../../services/user-service/user-service';

interface ThreadedComment {
  comment: Comment;
  replies: Comment[];
}

@Component({
  selector: 'jwpaisley-comments-section',
  standalone: true,
  imports: [CommonModule, RouterModule, Button, CommentInput, CommentComponent, Loader],
  templateUrl: './comments-section.html',
  styleUrl: './comments-section.scss',
})
export class CommentsSection implements OnInit, OnChanges, OnDestroy {
  @Input() resourceId: string | null = null;
  @Input() resourceType: CommentResourceType = 'PHOTO_COLLECTION';
  @ViewChild(CommentInput) private commentInput?: CommentInput;

  protected comments: Comment[] = [];
  protected threadedComments: ThreadedComment[] = [];
  protected commentsLoading = false;
  protected commentsError = false;
  protected commentCount = 0;
  protected isPostingComment = false;
  protected hasMoreComments = false;
  protected nextPageToken: string | null = null;
  protected isLoadingMoreComments = false;
  protected loadingRepliesForCommentIds = new Set<string>();
  protected currentUser: NonNullable<ReturnType<UserService['getUserInfoFromLocalStorage']>> | null = null;
  protected isLoggedIn = false;

  private destroy$ = new Subject<void>();

  constructor(
    private commentService: CommentService,
    private toastService: ToastService,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.userService.user$.pipe(takeUntil(this.destroy$)).subscribe((user) => {
      this.currentUser = user ?? null;
      this.isLoggedIn = !!user;
      this.cdr.detectChanges();
    });

    if (this.resourceId) {
      this.loadComments();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['resourceId'] || changes['resourceType']) && this.resourceId) {
      this.loadComments();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected loadComments(append = false): void {
    if (!this.resourceId) {
      return;
    }

    if (!append) {
      this.commentsLoading = true;
      this.commentsError = false;
    } else {
      this.isLoadingMoreComments = true;
    }

    this.cdr.detectChanges();

    this.commentService.getRootComments(
      this.resourceId,
      this.resourceType,
      append ? this.nextPageToken ?? undefined : undefined,
    ).pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {
        const pageItems = response.items ?? [];
        const nextComments = append ? [...this.comments, ...pageItems] : pageItems;
        this.comments = nextComments;
        this.threadedComments = [];
        this.commentCount = this.comments.length;
        this.hasMoreComments = !!response.nextPageToken;
        this.nextPageToken = response.nextPageToken ?? null;
        this.commentsLoading = false;
        this.isLoadingMoreComments = false;
        this.cdr.detectChanges();

        this.loadRepliesForRootComments();
      },
      error: (error) => {
        console.error(error);
        if (!append) {
          this.comments = [];
          this.commentCount = 0;
          this.commentsError = true;
        }
        this.commentsLoading = false;
        this.isLoadingMoreComments = false;
        this.cdr.detectChanges();
      },
    });
  }

  protected loadMoreComments(): void {
    if (!this.resourceId || !this.nextPageToken || this.isLoadingMoreComments || this.commentsLoading) {
      return;
    }

    this.loadComments(true);
  }

  protected refreshCommentsForSection(newComment?: Comment): void {
    if (!this.resourceId) {
      return;
    }

    if (newComment?.id) {
      const normalizedComment = this.normalizeComment(newComment);
      const alreadyExists = this.comments.some((existingComment) => existingComment.id === normalizedComment.id);

      if (!alreadyExists) {
        this.comments = [...this.comments, normalizedComment];
      } else {
        this.comments = this.comments.map((existingComment) => existingComment.id === normalizedComment.id ? normalizedComment : existingComment);
      }

      this.threadedComments = [];
      this.commentCount = this.comments.length;
      this.cdr.detectChanges();
      this.loadRepliesForRootComments();
      return;
    }

    this.loadComments();
  }

  handleCommentPost(commentText: string): void {
    if (!this.resourceId || !this.currentUser?.id || this.isPostingComment) {
      return;
    }

    this.isPostingComment = true;
    this.cdr.detectChanges();

    this.commentService.createComment({
      resource: this.resourceId,
      type: this.resourceType,
      text: commentText,
      userId: this.currentUser.id,
    }).pipe(takeUntil(this.destroy$)).subscribe({
      next: (createdComment) => {
        this.isPostingComment = false;
        this.commentInput?.reset();
        this.refreshCommentsForSection(createdComment);
        this.toastService.addToast('comment posted', 'comment', 'success');
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(error);
        this.isPostingComment = false;
        this.toastService.addToast('failed to post comment. please try again later.', 'error', 'danger');
        this.cdr.detectChanges();
      },
    });
  }

  private loadRepliesForRootComments(): void {
    if (!this.resourceId) {
      return;
    }

    const pendingRootComments = this.comments.filter((comment) => !comment.isReply && !comment.parentComment && !this.threadedComments.some((thread) => thread.comment.id === comment.id));

    pendingRootComments.forEach((rootComment) => {
      if (!rootComment.id || this.loadingRepliesForCommentIds.has(rootComment.id)) {
        return;
      }

      this.loadingRepliesForCommentIds.add(rootComment.id);
      this.commentService.getReplies(rootComment.id).pipe(takeUntil(this.destroy$)).subscribe({
        next: (response) => {
          const replies = response.items ?? [];
          const existingThread = this.threadedComments.find((thread) => thread.comment.id === rootComment.id);
          const nextThread = {
            comment: this.normalizeComment(rootComment),
            replies: replies.map((reply) => this.normalizeComment(reply)),
          };

          if (existingThread) {
            existingThread.replies = nextThread.replies;
          } else {
            this.threadedComments = [...this.threadedComments, nextThread];
          }

          this.threadedComments = this.threadedComments
            .filter((thread) => thread.comment.id)
            .sort((left, right) => this.compareCommentDates(right.comment, left.comment));

          if (rootComment.id) {
            this.loadingRepliesForCommentIds.delete(rootComment.id);
          }
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error(error);
          if (rootComment.id) {
            this.loadingRepliesForCommentIds.delete(rootComment.id);
          }
          this.cdr.detectChanges();
        },
      });
    });
  }

  private normalizeComment(comment: Comment): Comment {
    return {
      ...comment,
      isReply: Boolean(comment.isReply || comment.parentComment),
      parentComment: comment.parentComment ?? null,
    };
  }

  private compareCommentDates(left: Comment, right: Comment): number {
    const leftTime = left.createdAt ? new Date(left.createdAt).getTime() : 0;
    const rightTime = right.createdAt ? new Date(right.createdAt).getTime() : 0;

    return leftTime - rightTime;
  }
}
