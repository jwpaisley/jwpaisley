import { ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { UserProfile } from '../../components/user-profile/user-profile';
import { Login } from '../../components/login/login';
import { UserService } from '../../services/user-service/user-service';
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

  constructor(
    private cdr: ChangeDetectorRef, 
    private userService: UserService, 
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loggedIn = this.userService.isUserLoggedIn();
      this.isLoading = false;
    }
  }

  protected onLoginSuccess(): void {
    this.loggedIn = this.userService.isUserLoggedIn();
    this.cdr.detectChanges();
  }
}
