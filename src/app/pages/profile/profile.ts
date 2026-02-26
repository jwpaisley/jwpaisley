import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UserProfile } from '../../components/user-profile/user-profile';
import { Login } from '../../components/login/login';
import { UserService } from '../../services/user-service/user-service';

@Component({
  selector: 'jwpaisley-profile',
  imports: [UserProfile, Login],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
  protected loggedIn = false;

  constructor(private cdr: ChangeDetectorRef, private userService: UserService) {}

  ngOnInit(): void {
    this.loggedIn = this.userService.isUserLoggedIn();
  }

  protected onLoginSuccess(): void {
    this.loggedIn = true;
    this.cdr.detectChanges();
  }
}
