import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { User, UserService } from '../../services/user-service/user-service';

@Component({
  selector: 'jwpaisley-user-icon',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-icon.html',
  styleUrl: './user-icon.scss'
})
export class UserIcon implements OnInit {
  protected user: User | undefined = undefined;
  protected imageUrl: string | undefined = undefined;
  protected initials: string = '?';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.user = this.userService.getUserInfoFromLocalStorage();
    if (this.user) {
      this.initials = this.user.firstName.charAt(0) + this.user.lastName.charAt(0);
      this.imageUrl = this.user.imageUrl;
    }
  }
}