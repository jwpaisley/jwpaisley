import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'jwpaisley-tab',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './tab.html',
  styleUrl: './tab.scss',
})
export class Tab {
  @Input({ required: true }) link!: string;
}