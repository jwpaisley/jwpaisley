import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tag, TagComponent } from '../tag/tag';

@Component({
  selector: 'jwpaisley-tags-list',
  standalone: true,
  imports: [CommonModule, TagComponent],
  templateUrl: './tags-list.html',
  styleUrl: './tags-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagsListComponent {
  @Input() tags: Tag[] = [];
  @Output() tagSelected = new EventEmitter<string>();
  @Output() tagUnselected = new EventEmitter<string>();

  protected get sortedTags(): Tag[] {
    return [...this.tags].sort((left, right) => Number(right.selected) - Number(left.selected));
  }

  protected onTagSelected(tagId: string): void {
    this.tagSelected.emit(tagId);
  }

  protected onTagUnselected(tagId: string): void {
    this.tagUnselected.emit(tagId);
  }
}
