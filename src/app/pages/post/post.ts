import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Input, OnInit, PLATFORM_ID, SecurityContext, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Loader } from '../../components/loader/loader';
import { CommentsSection } from '../../components/comments-section/comments-section';
import { Button } from '../../components/button/button';
import { timestampToDateString } from '../../helpers/date-helper';
import { Post, PostStatus, PostsService } from '../../services/posts-service/posts-service';
import { DialogService } from '../../services/dialog-service/dialog-service';
import { ToastService } from '../../services/toast-service/toast-service';
import { UserService } from '../../services/user-service/user-service';
import { CreatePostDialogData } from '../../components/posts/add-post-dialog/add-post-dialog';

declare const marked: {
  parse: (input: string, options?: Record<string, unknown>) => string;
};

@Component({
  selector: 'jwpaisley-post-page',
  standalone: true,
  imports: [CommonModule, Loader, CommentsSection, Button],
  templateUrl: './post.html',
  styleUrl: './post.scss',
})
export class PostPage implements OnInit {
  @Input() id?: string;

  private readonly platformId = inject(PLATFORM_ID);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly postsService = inject(PostsService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly dialogService = inject(DialogService);
  private readonly toastService = inject(ToastService);
  private readonly userService = inject(UserService);

  protected isLoading = true;
  protected post: Post | null = null;
  protected renderedMarkdown = '';
  protected isBrowser = isPlatformBrowser(this.platformId);
  protected isUserAdmin = false;
  protected isSubmittingAction = false;

  protected get readTimeDisplay(): string | null {
    const minutes = this.post?.readingTime;

    if (minutes == null || minutes <= 0) {
      return null;
    }

    return `${minutes} min read`;
  }

  protected get viewCount(): string | null {
    const viewCount = this.post?.viewCount;

    if (viewCount == null || viewCount <= 0) {
      return null;
    }

    return `${viewCount} views`;
  }

  protected get createdAtDisplay(): string {
    return this.formatDateRow('created on', this.post?.createdAt);
  }

  protected get updatedAtDisplay(): string {
    return this.formatDateRow('updated on', this.post?.updatedAt);
  }

  protected get publishStatusDisplay(): string {
    if (!this.post) {
      return 'not published';
    }

    if (this.post.status === 'DRAFT') {
      return 'not published';
    }

    if (this.post.status === 'ARCHIVED') {
      return this.formatDateRow('archived on', this.post.archivedAt);
    }

    return this.formatDateRow('published on', this.post.publishedAt);
  }

  private formatDateRow(label: string, timestamp?: string | null): string {
    const value = timestampToDateString(timestamp ?? undefined);
    return `${label} ${value}`;
  }

  protected get showPublishButton(): boolean {
    return this.post?.status === 'DRAFT' || this.post?.status === 'ARCHIVED';
  }

  protected get showArchiveButton(): boolean {
    return this.post?.status === 'DRAFT' || this.post?.status === 'PUBLISHED';
  }

  protected get showUnpublishButton(): boolean {
    return this.post?.status === 'PUBLISHED';
  }

  protected async onPublishPost(): Promise<void> {
    if (!this.post || this.isSubmittingAction) {
      return;
    }

    await this.updatePostStatus('PUBLISHED', {
      publishedAt: this.post.publishedAt ?? new Date().toISOString(),
      archivedAt: null,
    }, 'post published successfully', 'failed to publish post');
  }

  protected async onArchivePost(): Promise<void> {
    if (!this.post || this.isSubmittingAction) {
      return;
    }

    await this.updatePostStatus('ARCHIVED', {
      archivedAt: new Date().toISOString(),
    }, 'post archived successfully', 'failed to archive post');
  }

  protected async onUnarchivePost(): Promise<void> {
    if (!this.post || this.isSubmittingAction) {
      return;
    }

    await this.updatePostStatus('PUBLISHED', {
      archivedAt: null,
      publishedAt: this.post.publishedAt ?? new Date().toISOString(),
    }, 'post unarchived successfully', 'failed to unarchive post');
  }

  protected async onUnpublishPost(): Promise<void> {
    if (!this.post || this.isSubmittingAction) {
      return;
    }

    await this.updatePostStatus('DRAFT', {
      publishedAt: null,
      archivedAt: null,
    }, 'post unpublished successfully', 'failed to unpublish post');
  }

  protected async onEditPost(): Promise<void> {
    if (!this.post || this.isSubmittingAction) {
      return;
    }

    const result = await this.dialogService.openCreatePostDialog<CreatePostDialogData>({
      title: 'edit post',
      icon: 'edit',
      confirmLabel: 'save changes',
      cancelLabel: 'cancel',
      value: {
        defaultType: this.post.type,
        post: {
          id: this.post.id,
          title: this.post.title,
          description: this.post.description,
          coverPhotoUrl: this.post.coverPhotoUrl,
          type: this.post.type,
          content: this.post.content,
          status: this.post.status,
        },
      },
    });

    if (!result.confirmed || !result.value) {
      return;
    }

    this.isSubmittingAction = true;

    try {
      const updatedPost: Post = {
        ...this.post,
        ...result.value,
        id: this.post.id,
      };

      const savedPost = await firstValueFrom(this.postsService.updatePost(updatedPost));
      this.post = savedPost;
      this.renderedMarkdown = this.renderMarkdown(this.post.content ?? '');
      this.toastService.addToast('post updated successfully', 'check', 'success');
    } catch (error) {
      console.error('Failed to update post:', error);
      this.toastService.addToast('failed to update post', 'error', 'danger');
    } finally {
      this.isSubmittingAction = false;
    }
  }

  protected async onDeletePost(): Promise<void> {
    if (!this.post || this.isSubmittingAction) {
      return;
    }

    this.isSubmittingAction = true;

    try {
      await firstValueFrom(this.postsService.deletePost(this.post.id));
      this.toastService.addToast('post deleted successfully', 'check', 'success');
      await this.router.navigate(['/']);
    } catch (error) {
      console.error('Failed to delete post:', error);
      this.toastService.addToast('failed to delete post', 'error', 'danger');
    } finally {
      this.isSubmittingAction = false;
    }
  }

  private async updatePostStatus(
    status: PostStatus,
    overrides: Partial<Post>,
    successMessage: string,
    errorMessage: string,
  ): Promise<void> {
    if (!this.post) {
      return;
    }

    this.isSubmittingAction = true;

    try {
      const updatedPost = {
        ...this.post,
        ...overrides,
        status,
      } satisfies Post;

      const savedPost = await firstValueFrom(this.postsService.updatePost(updatedPost));
      this.post = savedPost;
      this.renderedMarkdown = this.renderMarkdown(this.post.content ?? '');
      this.toastService.addToast(successMessage, 'check', 'success');
    } catch (error) {
      console.error('Failed to update post status:', error);
      this.toastService.addToast(errorMessage, 'error', 'danger');
    } finally {
      this.isSubmittingAction = false;
    }
  }

  async ngOnInit(): Promise<void> {
    this.isUserAdmin = this.userService.isUserAdmin();

    try {
      const routePostId = this.route.snapshot.paramMap.get('id') ?? this.id;

      if (!routePostId) {
        this.router.navigate(['/']);
        return;
      }

      const post = await firstValueFrom(this.postsService.getPost(routePostId));
      this.post = post;
      this.renderedMarkdown = this.renderMarkdown(post.content ?? '');
    } catch {
      this.router.navigate(['/']);
      return;
    } finally {
      this.isLoading = false;
    }
  }

  private renderMarkdown(content: string): string {
    const parsedHtml = typeof marked !== 'undefined' ? marked.parse(content ?? '', {
      gfm: true,
      breaks: true,
    }) : '';

    const htmlWithMarkdownLinkClasses = parsedHtml.replace(/<a\b/gi, '<a class="post-page__markdown-link"');

    return this.sanitizer.sanitize(SecurityContext.HTML, htmlWithMarkdownLinkClasses) ?? '';
  }
}
