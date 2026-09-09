import { computed, inject, Injectable, signal } from '@angular/core';
import { BoardService } from './board.service';
import { Cell } from '../model/cell';
import { Field } from '../model/field';
import { GameStatus } from '../model/game-status';
import { Player, PlayerId } from '../model/player';

/** What the setup screen collects; the game assigns the ids itself. */
export type PlayerSetup = Omit<Player, 'id'>;

const DISKS_PER_PLAYER = 21;

/**
 * Owns who is playing, whose turn it is and whether the game is over, and drives
 * {@link BoardService} for everything to do with the grid itself.
 */
@Injectable({
  providedIn: 'root',
})
export class GameService {
  private readonly boardService = inject(BoardService);

  readonly players = signal<[Player, Player] | null>(null);
  readonly currentPlayerId = signal<PlayerId>(PlayerId.ONE);
  readonly status = signal<GameStatus>(GameStatus.PLAYING);
  readonly winner = signal<Player | null>(null);
  readonly winningLine = signal<Cell[]>([]);

  /** The route guard uses this to keep `/game` unreachable until players are seated. */
  readonly isConfigured = computed(() => this.players() !== null);

  readonly currentPlayer = computed(() => this.players()?.[this.currentPlayerId()] ?? null);

  readonly isOver = computed(() => this.status() !== GameStatus.PLAYING);

  /** Disks each player has played, derived from the board rather than tracked separately. */
  private readonly disksPlayed = computed<[number, number]>(() => {
    const played: [number, number] = [0, 0];

    for (const column of this.boardService.board()) {
      for (const field of column) {
        if (field === Field.PLAYER_ONE) {
          played[PlayerId.ONE]++;
        } else if (field === Field.PLAYER_TWO) {
          played[PlayerId.TWO]++;
        }
      }
    }

    return played;
  });

  startGame(one: PlayerSetup, two: PlayerSetup): void {
    this.players.set([
      { id: PlayerId.ONE, ...one },
      { id: PlayerId.TWO, ...two },
    ]);
    this.resetRound();
  }

  /** Plays the current player's disk into `column`; a rejected drop costs nothing. */
  play(column: number): void {
    if (this.isOver()) {
      return;
    }

    const playerId = this.currentPlayerId();
    const row = this.boardService.drop(column, this.fieldFor(playerId));

    if (row === null) {
      return;
    }

    const line = this.boardService.findWinningLine(column, row);

    if (line) {
      this.status.set(GameStatus.WON);
      this.winner.set(this.players()?.[playerId] ?? null);
      this.winningLine.set(line);
      return;
    }

    if (this.boardService.isFull()) {
      this.status.set(GameStatus.DRAW);
      return;
    }

    this.currentPlayerId.set(playerId === PlayerId.ONE ? PlayerId.TWO : PlayerId.ONE);
  }

  remainingDisks(id: PlayerId): number {
    return DISKS_PER_PLAYER - this.disksPlayed()[id];
  }

  restartWithSamePlayers(): void {
    this.resetRound();
  }

  changePlayers(): void {
    this.players.set(null);
    this.resetRound();
  }

  private resetRound(): void {
    this.boardService.reset();
    this.currentPlayerId.set(PlayerId.ONE);
    this.status.set(GameStatus.PLAYING);
    this.winner.set(null);
    this.winningLine.set([]);
  }

  private fieldFor(id: PlayerId): Field {
    return id === PlayerId.ONE ? Field.PLAYER_ONE : Field.PLAYER_TWO;
  }
}
