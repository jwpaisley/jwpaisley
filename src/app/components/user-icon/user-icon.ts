import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'jwpaisley-user-icon',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-icon.html',
  styleUrl: './user-icon.scss'
})
export class UserIcon {
  @Input() imageUrl: string | null = null;
  @Input() initials: string = 'JP';
}