import { ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { UserProfile } from '../../components/user-profile/user-profile';
import { Login } from '../../components/login/login';
import { User, UserService } from '../../services/user-service/user-service';
import { isPlatformBrowser } from '@angular/common';
import { Loader } from '../../components/loader/loader';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { Subject } from 'rxjs/internal/Subject';
import { startWith } from 'rxjs';

@Component({
  selector: 'jwpaisley-profile',
  imports: [UserProfile, Login, Loader],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
  protected isLoading: boolean = true;
  protected loggedIn: boolean = false;
  protected user: User | undefined = undefined;
  private destroy$ = new Subject<void>();
  
  constructor(
    private cdr: ChangeDetectorRef, 
    private userService: UserService, 
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.subscribeToUserChanges();
    }
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
