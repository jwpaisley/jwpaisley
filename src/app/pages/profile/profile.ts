import { ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { UserProfile } from '../../components/user-profile/user-profile';
import { Login } from '../../components/login/login';
import { User, UserService } from '../../services/user-service/user-service';
import { isPlatformBrowser } from '@angular/common';
import { Loader } from '../../components/loader/loader';

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

  constructor(
    private cdr: ChangeDetectorRef, 
    private userService: UserService, 
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.getLoggedInUser();
  }

  protected onLoginSuccess(): void {
    this.getLoggedInUser();
  }

  protected getLoggedInUser(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loggedIn = this.userService.isUserLoggedIn();
      
      if (this.loggedIn) {
        this.user = this.userService.getUserInfoFromLocalStorage();
      }

      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }
}
