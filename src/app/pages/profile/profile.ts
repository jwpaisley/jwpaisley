import { ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { UserProfile } from '../../components/user-profile/user-profile';
import { Login } from '../../components/login/login';
import { User, UserService } from '../../services/user-service/user-service';
import { isPlatformBrowser } from '@angular/common';
import { Loader } from '../../components/loader/loader';
import { EmptyState } from '../../components/empty-state/empty-state';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'jwpaisley-profile',
  imports: [UserProfile, Login, Loader, EmptyState],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
  protected isLoading: boolean = true;
  protected loggedIn: boolean = false;
  protected isViewingSpecificUser = false;
  protected user: User | undefined = undefined;
  private destroy$ = new Subject<void>();
  
  constructor(
    private cdr: ChangeDetectorRef, 
    private userService: UserService, 
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const userId = params.get('id');

      if (userId) {
        this.isViewingSpecificUser = true;
        this.loadUserById(userId);
        return;
      }

      this.isViewingSpecificUser = false;
      this.subscribeToUserChanges();
    });
  }

  private subscribeToUserChanges(): void {
    this.userService.user$
      .pipe(
        takeUntil(this.destroy$),
      )
      .subscribe((user) => {
        this.user = user;
        this.loggedIn = !!user;
        this.isLoading = false;
        this.cdr.detectChanges();
      });
  }

  private loadUserById(userId: string): void {
    this.isLoading = true;

    this.userService.getUser(userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (user) => {
          this.user = user;
          this.loggedIn = true;
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.user = undefined;
          this.loggedIn = false;
          this.isLoading = false;
          this.cdr.detectChanges();
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
