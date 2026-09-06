import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { getApiUrl } from '../../helpers/api-url';

export type PostType = 'sailing' | 'movie_review' | 'hikes' | 'worldbuilding' | 'writing';
export type PostStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export function normalizePostType(value?: string | null): PostType {
  switch (value?.trim().toLowerCase()) {
    case 'sailing':
      return 'sailing';
    case 'movie_review':
    case 'movie review':
      return 'movie_review';
    case 'hikes':
    case 'hikes + surveying':
      return 'hikes';
    case 'worldbuilding':
      return 'worldbuilding';
    case 'writing':
      return 'writing';
    default:
      return 'sailing';
  }
}

export function normalizePostStatus(value?: string | null): PostStatus {
  switch (value?.trim().toLowerCase()) {
    case 'draft':
      return 'DRAFT';
    case 'published':
      return 'PUBLISHED';
    case 'archived':
      return 'ARCHIVED';
    default:
      return 'DRAFT';
  }
}

export function formatPostTypeForApi(value?: string | null): string {
  return normalizePostType(value).toUpperCase();
}

export function formatPostStatusForApi(value?: string | null): string {
  return normalizePostStatus(value);
}

export interface Post {
  id: string;
  title: string;
  description: string;
  coverPhotoUrl?: string | null;
  type: PostType;
  content: string;
  status: PostStatus;
  readingTime?: number | null;
  viewCount?: number | null;
  publishedAt?: string | null;
  archivedAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface PostPage {
  items: Post[];
  nextPageToken: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private readonly httpClient = inject(HttpClient);
  private readonly localApiUrl = 'http://localhost:8080/api/posts';
  private readonly prodApiUrl = 'https://api.jwpaisley.com/api/posts';
  private readonly apiUrl = getApiUrl(this.localApiUrl, this.prodApiUrl);

  getPosts(pageToken?: string, type?: PostType, pageSize = 20, drafts = false): Observable<PostPage> {
    let params = new HttpParams().set('pageSize', pageSize.toString()).set('drafts', drafts.toString());

    if (pageToken) {
      params = params.set('pageToken', pageToken);
    }

    const normalizedType = type ? normalizePostType(type) : undefined;
    if (normalizedType) {
      params = params.set('type', normalizedType);
    }

    return this.httpClient.get<PostPage>(this.apiUrl, { params });
  }

  getPost(postId: string): Observable<Post> {
    return this.httpClient.get<Post>(`${this.apiUrl}/${postId}`);
  }

  uploadPostMedia(file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);

    return this.httpClient.post<{ url: string }>(`${this.apiUrl}/upload-media`, formData);
  }

  uploadPostCover(file: File): Observable<{ url: string }> {
    return this.uploadPostMedia(file);
  }

  createPost(post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>): Observable<Post> {
    const normalizedPost = {
      ...post,
      type: formatPostTypeForApi(post.type) as PostType,
      status: formatPostStatusForApi(post.status) as PostStatus,
    };

    return this.httpClient.post<Post>(this.apiUrl, normalizedPost);
  }

  updatePost(post: Post): Observable<Post> {
    const normalizedPost = {
      ...post,
      type: formatPostTypeForApi(post.type) as PostType,
      status: formatPostStatusForApi(post.status) as PostStatus,
    };

    return this.httpClient.put<Post>(`${this.apiUrl}/${post.id}`, normalizedPost);
  }

  deletePost(postId: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${postId}`);
  }
}
