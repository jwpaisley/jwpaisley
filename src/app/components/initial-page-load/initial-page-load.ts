import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Loader } from '../loader/loader';

@Component({
  selector: 'jwpaisley-initial-page-load',
  standalone: true,
  imports: [CommonModule, Loader],
  templateUrl: './initial-page-load.html',
})
export class InitialPageLoadComponent implements OnInit {
  @Input() isLoading = true;

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.isLoading = false;
    }
  }
}
