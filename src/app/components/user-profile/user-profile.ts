import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { User, UserService } from '../../services/user-service/user-service';
import { UserCard } from '../user-card/user-card';
import { ConfirmationDialog } from '../confirmation-dialog/confirmation-dialog';

@Component({
  standalone: true,
  selector: 'jwpaisley-user-profile',
  imports: [UserCard, ConfirmationDialog],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.scss',
})
export class UserProfile {
  @Input({required: true}) user!: User;

  constructor(
    private cdr: ChangeDetectorRef,
    private userService: UserService
  ) {}

  protected showLogoutConfirmation = false;

  protected showLogoutConfirmationDialog(): void {
    this.showLogoutConfirmation = true;
    this.cdr.detectChanges();
  }

  protected handleLogout(): void {
    this.userService.performLogout();
    this.showLogoutConfirmation = false;
    this.cdr.detectChanges();
  }

  protected cancelLogout(): void {
    this.showLogoutConfirmation = false;
    this.cdr.detectChanges();
  }
}
