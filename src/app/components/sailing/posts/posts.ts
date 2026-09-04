import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { EmptyState } from '../../empty-state/empty-state';
import { Loader } from '../../loader/loader';
import { ActionDock } from '../../action-dock/action-dock';
import { ActionDockButton } from '../../action-dock-button/action-dock-button';
import { UserService } from '../../../services/user-service/user-service';
import { ActionsService, Action } from '../../../services/actions-service/actions-service';
import { DialogService } from '../../../services/dialog-service/dialog-service';
import { ToastService } from '../../../services/toast-service/toast-service';
import { Post, PostsService } from '../../../services/posts-service/posts-service';
import { CreatePostDialogData } from '../create-post-dialog/create-post-dialog';
import { CardGrid } from '../../card-grid/card-grid';
import { Card } from '../../card/card';

@Component({
  selector: 'jwpaisley-sailing-posts',
  standalone: true,
  imports: [CommonModule, Loader, EmptyState, ActionDock, ActionDockButton, CardGrid, Card],
  templateUrl: './posts.html',
  styleUrl: './posts.scss',
})
export class Posts implements OnInit {
  private readonly destroy$ = new Subject<void>();

  draftPosts: Post[] = [];
  publishedPosts: Post[] = [];
  isLoadingDrafts = true;
  isLoadingPosts = true;
  isUserAdmin = false;

  constructor(
    private readonly userService: UserService,
    private readonly actionsService: ActionsService,
    private readonly dialogService: DialogService,
    private readonly postsService: PostsService,
    private readonly toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.isUserAdmin = this.userService.isUserAdmin();

    this.userService.user$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.isUserAdmin = this.userService.isUserAdmin();
    });

    this.actionsService.actionEmitted$.pipe(takeUntil(this.destroy$)).subscribe((action: Action) => {
      if (action.type === 'add') {
        void this.openCreatePostDialog();
      }
    });

    this.loadPosts();
  }

  private loadPosts(): void {
    this.isLoadingDrafts = true;
    this.isLoadingPosts = true;

    this.postsService.getPosts(undefined, 'sailing', 20, true).pipe(takeUntil(this.destroy$)).subscribe({
      next: (page) => {
        this.draftPosts = page.items;
        this.isLoadingDrafts = false;
      },
      error: () => {
        this.draftPosts = [];
        this.isLoadingDrafts = false;
        this.toastService.addToast('failed to fetch drafts', 'error', 'danger');
      },
    });

    this.postsService.getPosts(undefined, 'sailing', 20, false).pipe(takeUntil(this.destroy$)).subscribe({
      next: (page) => {
        this.publishedPosts = page.items;
        this.isLoadingPosts = false;
      },
      error: () => {
        this.publishedPosts = [];
        this.isLoadingPosts = false;
        this.toastService.addToast('failed to fetch posts', 'error', 'danger');
      },
    });
  }

  private async openCreatePostDialog(): Promise<void> {
    if (!this.isUserAdmin) {
      return;
    }

    const result = await this.dialogService.openCreatePostDialog<CreatePostDialogData>({
      title: 'create post',
      icon: 'article',
      confirmLabel: 'save post',
      cancelLabel: 'cancel',
    });

    if (result.confirmed && result.value) {
      this.isLoadingPosts = true;

      this.postsService.createPost(result.value).pipe(takeUntil(this.destroy$)).subscribe({
        next: () => {
          this.loadPosts();
        },
        error: () => {
          this.isLoadingPosts = false;
          this.toastService.addToast('failed to create post', 'error', 'danger');
        },
      });
    }
  }
}
