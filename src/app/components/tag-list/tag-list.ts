import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tag, TagComponent } from '../tag/tag';

@Component({
  selector: 'jwpaisley-tag-list',
  standalone: true,
  imports: [CommonModule, TagComponent],
  templateUrl: './tag-list.html',
  styleUrl: './tag-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagListComponent {
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
