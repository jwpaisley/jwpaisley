import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CommentService } from './comment-service';

describe('CommentService', () => {
  let service: CommentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(CommentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a comment', () => {
    const payload = { resource: 'abc', type: 'PHOTO' as const, text: 'hello' };

    service.createComment(payload).subscribe();

    const req = httpMock.expectOne('https://api.jwpaisley.com/api/comments');
    expect(req.request.method).toBe('POST');
    req.flush(payload);
  });
});
