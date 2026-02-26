import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject, takeUntil } from 'rxjs';
import { UserIcon } from '../user-icon/user-icon';
import { User, UserService } from '../../services/user-service/user-service';
import { Button } from '../button/button';

@Component({
  selector: 'jwpaisley-user-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, UserIcon, Button],
  templateUrl: './user-card.html',
  styleUrl: './user-card.scss'
})
export class UserCard implements OnInit, OnDestroy {
  @Input({required: true}) user!: User;
  @Output() performLogout = new EventEmitter<void>();
  
  protected isHandheld = false;
  private destroyed = new Subject<void>();

  constructor(
    private breakpointObserver: BreakpointObserver,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .pipe(takeUntil(this.destroyed))
      .subscribe(result => {
        this.isHandheld = result.matches;
      });
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }

  protected isCurrentUser(): boolean {
    const loggedInUser = this.userService.getUserInfoFromLocalStorage();
    return loggedInUser ? loggedInUser.email === this.user.email : false;
  }

  protected logout(): void {
    this.performLogout.emit();
  }
}