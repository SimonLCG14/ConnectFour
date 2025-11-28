import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {PlayerComponent} from './components/player-component/player.component';
import {GameWindowComponent} from './components/game-window/game-window.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PlayerComponent, GameWindowComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('connect-four');
}
