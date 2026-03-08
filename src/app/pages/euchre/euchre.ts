import { Component } from '@angular/core';
import { EuchreCanvas } from '../../components/euchre/euchre-game-canvas/euchre-game-canvas';

@Component({
  selector: 'app-euchre',
  imports: [EuchreCanvas],
  templateUrl: './euchre.html',
  styleUrl: './euchre.scss',
})
export class Euchre {

}
