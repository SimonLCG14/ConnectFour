import { Component } from '@angular/core';
import {PlayerComponent} from "../player-component/player.component";
import {BoardComponent} from '../board/board.component';

@Component({
  selector: 'app-game-window',
  imports: [
    PlayerComponent,
    BoardComponent
  ],
  templateUrl: './game-window.component.html',
  styleUrl: './game-window.component.scss',
})
export class GameWindowComponent {

}
