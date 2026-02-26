import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { User, UserService } from '../../services/user-service/user-service';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';

@Component({
  selector: 'jwpaisley-user-icon',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-icon.html',
  styleUrl: './user-icon.scss'
})
export class UserIcon implements OnInit, OnDestroy {
  protected user: User | undefined = undefined;
  protected imageUrl: string | undefined = undefined;
  protected initials: string = '?';
  
  private destroy$ = new Subject<void>();

  constructor(
    private cdr: ChangeDetectorRef,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userService.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.user = user;
        
        if (user) {
          this.initials = (user.firstName.charAt(0) + user.lastName.charAt(0)).toUpperCase();
          this.imageUrl = user.imageUrl;
        } else {
          this.initials = '?';
          this.imageUrl = undefined;
        }

        this.cdr.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}