import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Button } from '../button/button';

export enum TableCellType {
  TEXT = 'text',
  IMAGE = 'image',
  BUTTON = 'button',
  CURRENCY = 'currency'
}

export interface TableRow {
  cells: {
    type: TableCellType;
    data: any;
    action?: (data: any) => void;
  }[];
}

@Component({
  selector: 'jwpaisley-table',
  standalone: true,
  imports: [CommonModule, Button],
  templateUrl: './table.html',
  styleUrl: './table.scss'
})
export class Table {
  @Input({ required: true }) headers!: string[];
  @Input({ required: true }) rows!: TableRow[];
  @Input() mobileVisibleIndices: number[] = [];

  readonly CellType = TableCellType;
}