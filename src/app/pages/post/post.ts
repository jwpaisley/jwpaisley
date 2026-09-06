import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, Input, OnInit, PLATFORM_ID, SecurityContext, inject } from '@angular/core';
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
  private readonly elementRef = inject(ElementRef<HTMLElement>);

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
      this.scheduleMarkdownAnchorSync();
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
      this.scheduleMarkdownAnchorSync();
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
      this.scheduleMarkdownAnchorSync();
    } catch {
      this.router.navigate(['/']);
      return;
    } finally {
      this.isLoading = false;
    }
  }

  private scheduleMarkdownAnchorSync(): void {
    if (typeof document === 'undefined' || typeof window === 'undefined') {
      return;
    }

    setTimeout(() => this.syncMarkdownAnchors(), 0);
  }

  private syncMarkdownAnchors(): void {
    if (typeof document === 'undefined' || typeof window === 'undefined') {
      return;
    }

    const container = this.elementRef.nativeElement.querySelector('.post-page__markdown');
    if (!container) {
      return;
    }

    const headings = Array.from(
      container.querySelectorAll('h1, h2, h3, h4, h5, h6') as NodeListOf<HTMLHeadingElement>,
    );
    const seenIds = new Map<string, number>();

    headings.forEach((heading: HTMLHeadingElement) => {
      const text = heading.textContent ?? '';
      const baseSlug = this.buildSlug(text);
      let newSlug = baseSlug;
      const previousCount = seenIds.get(baseSlug) ?? 0;
      seenIds.set(baseSlug, previousCount + 1);

      if (previousCount > 0) {
        newSlug = `${baseSlug}-${previousCount}`;
      }

      if (!heading.id) {
        heading.id = newSlug;
      }
    });

    const links = Array.from(container.querySelectorAll('a[href]') as NodeListOf<HTMLAnchorElement>);
    links.forEach((link: HTMLAnchorElement) => {
      const rawHref = link.getAttribute('href');
      if (!rawHref || !rawHref.includes('#')) {
        return;
      }

      const targetUrl = new URL(rawHref, window.location.href);
      const hash = decodeURIComponent(targetUrl.hash.replace(/^#/, ''));
      if (!hash) {
        return;
      }

      const target = document.getElementById(hash);
      if (target) {
        link.setAttribute('href', this.getCurrentPostPathWithHash(hash));
      }

      link.onclick = (event: MouseEvent) => {
        event.preventDefault();
        this.scrollToHashTarget(hash);
      };
    });

    if (window.location.hash) {
      this.scrollToHashTarget(window.location.hash.slice(1));
    }
  }

  private scrollToHashTarget(hash: string): void {
    if (typeof document === 'undefined' || typeof window === 'undefined' || !hash) {
      return;
    }

    const target = document.getElementById(hash) ?? document.getElementById(decodeURIComponent(hash));
    if (!target) {
      return;
    }

    window.setTimeout(() => {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      const currentUrl = new URL(window.location.href);
      currentUrl.hash = hash;
      window.history.replaceState(null, '', `${currentUrl.pathname}${currentUrl.search}#${hash}`);
    }, 0);
  }

  private readonly handleHashChange = (): void => {
    if (!window.location.hash) {
      return;
    }

    this.scrollToHashTarget(window.location.hash.slice(1));
  };

  private buildSlug(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/&amp;/g, 'and')
      .replace(/&/g, 'and')
      .replace(/[`~!@#$%^&*()+=\[\]{}|\\:;"'<>,.?/]+/g, '-')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || 'section';
  }

  private getCurrentPostPathWithHash(hash: string): string {
    const postId = this.route.snapshot.paramMap.get('id') ?? this.id;

    if (!postId) {
      return `#${hash}`;
    }

    return `/post/${postId}#${hash}`;
  }

  private renderMarkdown(content: string): string {
    const parsedHtml = typeof marked !== 'undefined' ? marked.parse(content ?? '', {
      gfm: true,
      breaks: true,
    }) : '';

    const htmlWithHeadingIds = parsedHtml.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/gi, (match, level, attrs, innerHtml) => {
      const hasId = /\s+id=\s*["'][^"']+["']/i.test(attrs);
      if (hasId) {
        return match;
      }

      const text = innerHtml
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/gi, ' ')
        .replace(/&amp;/gi, '&')
        .replace(/&lt;/gi, '<')
        .replace(/&gt;/gi, '>')
        .replace(/&quot;/gi, '"')
        .replace(/&#39;/gi, "'")
        .replace(/&#x27;/gi, "'")
        .replace(/&#x2F;/gi, '/')
        .trim();

      return `<h${level}${attrs} id="${this.buildSlug(text)}">${innerHtml}</h${level}>`;
    });

    const htmlWithResolvedAnchorLinks = htmlWithHeadingIds.replace(
      /href=(['"])(#[^'"]+|post\/[^'"#]+#[^'"]+|post\/[^'"#]+)(\1)/gi,
      (match, quote, href) => {
        if (href.startsWith('#')) {
          const hash = href.slice(1);
          return `href=${quote}${this.getCurrentPostPathWithHash(hash)}${quote}`;
        }

        const normalizedHref = href.startsWith('post/') ? `/${href}` : href;
        return `href=${quote}${normalizedHref}${quote}`;
      }
    );

    const htmlWithMarkdownLinkClasses = htmlWithResolvedAnchorLinks.replace(/<a\b/gi, '<a class="post-page__markdown-link"');
    return this.sanitizer.sanitize(SecurityContext.HTML, htmlWithMarkdownLinkClasses) ?? '';
  }
}
