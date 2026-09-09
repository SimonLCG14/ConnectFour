import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DiskComponent } from '../disk/disk.component';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-setup',
  imports: [DiskComponent],
  templateUrl: './setup.component.html',
  styleUrl: './setup.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetupComponent {
  private readonly game = inject(GameService);
  private readonly router = inject(Router);

  playerOneName = signal('Player 1');
  playerTwoName = signal('Player 2');
  playerOneColor = signal('#3241b8');
  playerTwoColor = signal('#eb4034');

  canStart = computed(
    () =>
      this.playerOneName().trim() !== '' &&
      this.playerTwoName().trim() !== '' &&
      this.playerOneColor().toLowerCase() !== this.playerTwoColor().toLowerCase(),
  );

  /** Explains to the players why Start is unavailable. */
  hint = computed(() => {
    if (this.playerOneName().trim() === '' || this.playerTwoName().trim() === '') {
      return 'Both players need a name.';
    }
    if (this.playerOneColor().toLowerCase() === this.playerTwoColor().toLowerCase()) {
      return 'Pick two different colours so the disks stay apart.';
    }
    return '';
  });

  start(): void {
    if (!this.canStart()) {
      return;
    }

    this.game.startGame(
      { name: this.playerOneName().trim(), color: this.playerOneColor() },
      { name: this.playerTwoName().trim(), color: this.playerTwoColor() },
    );
    this.router.navigate(['/game']);
  }
}
