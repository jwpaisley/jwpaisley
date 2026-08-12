import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

export interface KeyValueListItem {
  key: string;
  value: string;
  color?: string;
  imageUrl?: string;
}

@Component({
  selector: 'jwpaisley-key-value-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './key-value-list.html',
  styleUrl: './key-value-list.scss',
})
export class KeyValueList {
  @Input() keyValuePairs: KeyValueListItem[] = [];

  get entries(): KeyValueListItem[] {
    return this.keyValuePairs;
  }
}
