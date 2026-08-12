import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TabGroup } from '../../components/tab-group/tab-group';
import { Tab } from '../../components/tab/tab';

@Component({
  selector: 'jwpaisley-sports-predictions',
  imports: [TabGroup, Tab, RouterOutlet],
  templateUrl: './sports-predictions.html',
  styleUrl: './sports-predictions.scss',
})
export class SportsPredictionsPage {}
