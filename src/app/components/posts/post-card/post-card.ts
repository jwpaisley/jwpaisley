import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Post } from '../../../services/posts-service/posts-service';
import { Card } from '../../card/card';

@Component({
  selector: 'jwpaisley-post-card',
  standalone: true,
  imports: [CommonModule, Card, RouterLink],
  templateUrl: './post-card.html',
  styleUrl: './post-card.scss',
})
export class PostCard {
  @Input() post!: Post;

  get excerpt(): string {
    const description = this.post?.description?.trim() ?? 'no description available';
    return description.length > 160 ? `${description.slice(0, 160)}...` : description;
  }
}
