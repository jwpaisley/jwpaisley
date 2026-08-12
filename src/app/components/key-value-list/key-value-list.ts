import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'jwpaisley-key-value-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './key-value-list.html',
  styleUrl: './key-value-list.scss',
})
export class KeyValueList {
  @Input() keyValuePairs: Map<string, string> = new Map();

  get entries(): Array<[string, string]> {
    return Array.from(this.keyValuePairs.entries());
  }
}
