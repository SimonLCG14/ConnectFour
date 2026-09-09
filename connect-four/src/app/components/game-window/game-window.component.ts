import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BoardComponent } from '../board/board.component';
import { GameOverComponent } from '../game-over/game-over.component';
import { PlayerComponent } from '../player-component/player.component';
import { GameService } from '../../services/game.service';
import { PlayerId } from '../../model/player';

@Component({
  selector: 'app-game-window',
  imports: [PlayerComponent, BoardComponent, GameOverComponent],
  templateUrl: './game-window.component.html',
  styleUrl: './game-window.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameWindowComponent {
  protected readonly game = inject(GameService);
  private readonly router = inject(Router);

  protected readonly PlayerId = PlayerId;

  changePlayers(): void {
    this.game.changePlayers();
    this.router.navigate(['/setup']);
  }
}
