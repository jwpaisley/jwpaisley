import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';

import { UserService } from './user-service';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: PLATFORM_ID, useValue: 'browser' }],
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should preserve the auth token when refreshing the current user', () => {
    service.saveUserInfoToLocalStorage({
      id: 'user-1',
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      imageUrl: '',
      token: 'abc123',
    } as any);

    service.getUser('user-1').subscribe();

    const req = httpMock.expectOne((request) => request.url.includes('/users/user-1'));
    req.flush({
      id: 'user-1',
      first_name: 'Jane',
      last_name: 'Doe',
      email_address: 'jane@example.com',
      profile_picture_url: '',
      coins: 0,
    });

    const storedUser = service.getUserInfoFromLocalStorage();
    expect(storedUser?.token).toBe('abc123');
  });
});
