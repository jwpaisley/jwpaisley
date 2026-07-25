import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TabGroup } from '../../components/tab-group/tab-group';
import { Tab } from '../../components/tab/tab';

@Component({
  selector: 'jwpaisley-sailing',
  imports: [TabGroup, Tab, RouterOutlet],
  templateUrl: './sailing.html',
  styleUrl: './sailing.scss',
})
export class Sailing {}
