import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {PlayerComponentComponent} from './components/player-component/player-component.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PlayerComponentComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('connect-four');
}
