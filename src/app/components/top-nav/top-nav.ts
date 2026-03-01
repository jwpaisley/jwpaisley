import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserIcon } from '../user-icon/user-icon';
import { UserService } from '../../services/user-service/user-service';
import { Button } from '../button/button';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';

@Component({
  selector: 'jwpaisley-top-nav',
  imports: [UserIcon, RouterModule, Button],
  templateUrl: './top-nav.html',
  styleUrl: './top-nav.scss',
})
export class TopNav implements OnInit, OnDestroy {
  @Input() showUserIcon = true;

  protected isUserLoggedIn = false;
  protected isUserAdmin = false;
  private destroy$ = new Subject<void>();
  
  constructor(
    private cdr: ChangeDetectorRef,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userService.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.isUserLoggedIn = !!user;
        this.isUserAdmin = this.userService.isUserAdmin();
        this.cdr.detectChanges();
      });
  }

  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}