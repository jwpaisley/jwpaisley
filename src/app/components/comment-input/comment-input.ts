import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Button } from '../button/button';
import { FormTextArea } from '../form-text-area/form-text-area';
import { User } from '../../services/user-service/user-service';

@Component({
  selector: 'jwpaisley-comment-input',
  standalone: true,
  imports: [CommonModule, RouterModule, Button, FormTextArea],
  templateUrl: './comment-input.html',
  styleUrl: './comment-input.scss',
})
export class CommentInput {
  @Input() user: User | null = null;
  @Input() placeholder: string = 'write a comment';
}
