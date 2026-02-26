import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserIcon } from '../user-icon/user-icon';
import { UserService } from '../../services/user-service/user-service';
import { Button } from '../button/button';

@Component({
  selector: 'jwpaisley-top-nav',
  imports: [UserIcon, RouterModule, Button],
  templateUrl: './top-nav.html',
  styleUrl: './top-nav.scss',
})
export class TopNav implements OnInit {
  @Input() showUserIcon = true;

  protected isUserLoggedIn = false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.isUserLoggedIn = this.userService.isUserLoggedIn();
  }
}