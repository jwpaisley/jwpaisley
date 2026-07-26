import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { getApiUrl } from '../../helpers/api-url';
import { UserService } from '../user-service/user-service';

export type CommentResourceType = 'PHOTO' | 'PHOTO_COLLECTION' | 'RECIPE';

export interface Comment {
  id?: string;
  user?: string;
  resource?: string;
  type: CommentResourceType;
  isReply: boolean;
  parentComment?: string | null;
  text: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CommentPage {
  items: Comment[];
  nextPageToken: string | null;
}

export interface CommentCreatePayload {
  resource: string;
  type: CommentResourceType;
  text: string;
  userId?: string;
  isReply?: boolean;
  parentComment?: string | null;
}

export interface CommentUpdatePayload {
  text: string;
}

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private httpClient = inject(HttpClient);
  private userService = inject(UserService);
  private readonly localApiUrl = 'http://localhost:8080/api/comments';
  private readonly prodApiUrl = 'https://api.jwpaisley.com/api/comments';
  private readonly apiUrl = getApiUrl(this.localApiUrl, this.prodApiUrl);

  private getAuthHeaders(): HttpHeaders {
    const token = this.userService.getAuthToken()?.trim();

    if (!token) {
      return new HttpHeaders();
    }

    const normalizedToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    return new HttpHeaders({
      Authorization: normalizedToken,
    });
  }

  createComment(payload: CommentCreatePayload): Observable<Comment> {
    return this.httpClient.post<Comment>(this.apiUrl, payload, { headers: this.getAuthHeaders() });
  }

  getComment(commentId: string): Observable<Comment> {
    return this.httpClient.get<Comment>(`${this.apiUrl}/${commentId}`, { headers: this.getAuthHeaders() });
  }

  getCommentsForResource(resourceId: string, type: CommentResourceType, pageToken?: string): Observable<CommentPage> {
    let params = new HttpParams().set('commentType', type);

    if (pageToken) {
      params = params.set('pageToken', pageToken);
    }

    return this.httpClient.get<CommentPage>(`${this.apiUrl}/resource/${resourceId}`, { params, headers: this.getAuthHeaders() });
  }

  getRootComments(resourceId: string, type: CommentResourceType, pageToken?: string): Observable<CommentPage> {
    let params = new HttpParams().set('commentType', type);

    if (pageToken) {
      params = params.set('pageToken', pageToken);
    }

    return this.httpClient.get<CommentPage>(`${this.apiUrl}/root/${resourceId}`, { params, headers: this.getAuthHeaders() });
  }

  getReplies(parentCommentId: string, pageToken?: string): Observable<CommentPage> {
    let params = new HttpParams();

    if (pageToken) {
      params = params.set('pageToken', pageToken);
    }

    return this.httpClient.get<CommentPage>(`${this.apiUrl}/replies/${parentCommentId}`, { params, headers: this.getAuthHeaders() });
  }

  updateComment(commentId: string, payload: CommentUpdatePayload): Observable<Comment> {
    return this.httpClient.put<Comment>(`${this.apiUrl}/${commentId}`, payload, { headers: this.getAuthHeaders() });
  }

  deleteComment(commentId: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${commentId}`, { headers: this.getAuthHeaders() });
  }
}
