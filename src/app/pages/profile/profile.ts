import { Component } from '@angular/core';
import { UserProfile } from '../../components/user-profile/user-profile';
import { Login } from '../../components/login/login';

@Component({
  selector: 'jwpaisley-profile',
  imports: [UserProfile, Login],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  protected readonly loggedIn = false;
}
