import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Player } from '../../model/player';

@Component({
  selector: 'app-game-over',
  imports: [],
  templateUrl: './game-over.component.html',
  styleUrl: './game-over.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameOverComponent {
  /** `null` for a draw. */
  winner = input<Player | null>(null);

  restart = output<void>();
  changePlayers = output<void>();
}
