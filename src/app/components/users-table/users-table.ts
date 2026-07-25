import { Component, inject, OnInit } from '@angular/core';
import { Table, TableCellType, TableRow } from '../table/table';
import { Button } from '../button/button';
import { Loader } from '../loader/loader';
import { timestampToDateString } from '../../helpers/date-helper';
import { User, UserService } from '../../services/user-service/user-service';
import { Router } from '@angular/router';

@Component({
  selector: 'jwpaisley-users-table',
  imports: [Table, Button, Loader],
  templateUrl: './users-table.html',
  styleUrl: './users-table.scss',
})
export class UsersTable implements OnInit {
  private userService = inject(UserService);
  private router = inject(Router);

  protected isLoading = true;
  protected isLoadingMore = false;
  protected users: User[] = [];
  protected hasMoreUsers = false;
  protected nextPageToken: string | null = null;

  protected tableHeaders: string[] = ['', 'name', 'last login', 'joined'];

  protected get tableRows(): TableRow[] {
    return this.users.map((user): TableRow => ({
      action: () => this.navigateToProfile(user),
      cells: [
        {
          type: TableCellType.IMAGE,
          data: user.imageUrl || 'https://placehold.co/80x80/edf2f7/4a5568?text=U',
        },
        {
          type: TableCellType.TEXT,
          data: [user.firstName, user.lastName].filter(Boolean).join(' ') || '—',
        },
        { type: TableCellType.TEXT, data: timestampToDateString(user.lastLogin) },
        { type: TableCellType.TEXT, data: timestampToDateString(user.createdAt) },
      ],
    }));
  }

  protected mobileColumns = [0, 1, 2, 3];

  protected navigateToProfile(user: User): void {
    if (user.id) {
      this.router.navigate(['/profile', user.id]);
    }
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  protected loadUsers(pageToken?: string): void {
    if (pageToken) {
      this.isLoadingMore = true;
    } else {
      this.isLoading = true;
    }

    this.userService.getUsers(pageToken).subscribe({
      next: (page) => {
        this.users = pageToken ? [...this.users, ...page.items] : page.items;
        this.nextPageToken = page.nextPageToken;
        this.hasMoreUsers = !!page.nextPageToken;
        this.isLoading = false;
        this.isLoadingMore = false;
      },
      error: () => {
        this.isLoading = false;
        this.isLoadingMore = false;
      },
    });
  }

  protected loadMoreUsers(): void {
    if (!this.hasMoreUsers || !this.nextPageToken) {
      return;
    }

    this.loadUsers(this.nextPageToken);
  }
}
