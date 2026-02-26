import { Component, Input } from '@angular/core';
import { User } from '../../services/user-service/user-service';
import { UserCard } from '../user-card/user-card';

@Component({
  standalone: true,
  selector: 'jwpaisley-user-profile',
  imports: [UserCard],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.scss',
})
export class UserProfile {
  @Input({required: true}) user!: User;
}
