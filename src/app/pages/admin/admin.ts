import { Component } from '@angular/core';
import { UsersTable } from '../../components/users-table/users-table';

@Component({
  selector: 'jwpaisley-admin',
  imports: [UsersTable],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class AdminPage {

}
