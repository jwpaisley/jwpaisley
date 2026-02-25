import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserIcon } from '../user-icon/user-icon';

@Component({
  selector: 'jwpaisley-top-nav',
  imports: [UserIcon, RouterModule],
  templateUrl: './top-nav.html',
  styleUrl: './top-nav.scss',
})
export class TopNav {

}