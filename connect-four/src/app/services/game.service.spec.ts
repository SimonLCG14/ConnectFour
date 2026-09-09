import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { GameService } from './game.service';
import { BoardService } from './board.service';
import { Field } from '../model/field';
import { GameStatus } from '../model/game-status';
import { PlayerId } from '../model/player';

const ADA = { name: 'Ada', color: '#3241b8' };
const LINUS = { name: 'Linus', color: '#eb4034' };

describe('GameService', () => {
  let game: GameService;
  let board: BoardService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
    game = TestBed.inject(GameService);
    board = TestBed.inject(BoardService);
  });

  /** Wins column 0 for player one; player two answers in column 1 each time. */
  function winColumnZeroForPlayerOne(): void {
    for (let move = 0; move < 3; move++) {
      game.play(0);
      game.play(1);
    }
    game.play(0);
  }

  describe('startGame', () => {
    it('is not configured until players are set', () => {
      expect(game.isConfigured()).toBeFalse();

      game.startGame(ADA, LINUS);

      expect(game.isConfigured()).toBeTrue();
    });

    it('seats the players and gives the first turn to player one', () => {
      game.startGame(ADA, LINUS);

      expect(game.players()).toEqual([
        { id: PlayerId.ONE, ...ADA },
        { id: PlayerId.TWO, ...LINUS },
      ]);
      expect(game.currentPlayer()).toEqual({ id: PlayerId.ONE, ...ADA });
      expect(game.status()).toBe(GameStatus.PLAYING);
    });

    it('clears a finished game', () => {
      game.startGame(ADA, LINUS);
      winColumnZeroForPlayerOne();

      game.startGame(ADA, LINUS);

      expect(game.status()).toBe(GameStatus.PLAYING);
      expect(game.winner()).toBeNull();
      expect(game.winningLine()).toEqual([]);
      expect(board.isFull()).toBeFalse();
      expect(
        board
          .board()
          .flat()
          .every((field) => field === Field.NONE),
      ).toBeTrue();
    });
  });

  describe('play', () => {
    beforeEach(() => game.startGame(ADA, LINUS));

    it('drops a disk in the current player’s colour and passes the turn', () => {
      game.play(3);

      expect(board.board()[3][0]).toBe(Field.PLAYER_ONE);
      expect(game.currentPlayerId()).toBe(PlayerId.TWO);

      game.play(3);

      expect(board.board()[3][1]).toBe(Field.PLAYER_TWO);
      expect(game.currentPlayerId()).toBe(PlayerId.ONE);
    });

    it('does not consume the turn when the column is out of range', () => {
      game.play(99);

      expect(game.currentPlayerId()).toBe(PlayerId.ONE);
    });

    it('does not consume the turn when the column is full', () => {
      for (let i = 0; i < board.ROWS; i++) {
        board.drop(2, Field.PLAYER_TWO);
      }

      game.play(2);

      expect(game.currentPlayerId()).toBe(PlayerId.ONE);
    });

    it('is ignored once the game is over', () => {
      winColumnZeroForPlayerOne();
      const finished = board.board();

      game.play(5);

      expect(board.board()).toBe(finished);
    });
  });

  describe('ending the game', () => {
    beforeEach(() => game.startGame(ADA, LINUS));

    it('records the winner and the winning line on four in a row', () => {
      winColumnZeroForPlayerOne();

      expect(game.status()).toBe(GameStatus.WON);
      expect(game.winner()).toEqual({ id: PlayerId.ONE, ...ADA });
      expect(game.winningLine().length).toBe(4);
      expect(game.winningLine()).toContain({ column: 0, row: 0 });
    });

    it('declares a draw when the last slot is filled with no line', () => {
      // A board where no run reaches four, with the top of column 0 left open.
      // The pattern ((row + 2 * column) % 4 < 2) caps every run at two.
      const drawn: Field[][] = Array.from({ length: board.COLUMNS }, (_, column) =>
        Array.from({ length: board.ROWS }, (_, row) =>
          (row + 2 * column) % 4 < 2 ? Field.PLAYER_ONE : Field.PLAYER_TWO,
        ),
      );
      drawn[0][board.ROWS - 1] = Field.NONE;
      board.board.set(drawn);

      // Player one is still to move, and the pattern wants PLAYER_ONE in that slot.
      game.play(0);

      expect(board.isFull()).toBeTrue();
      expect(game.status()).toBe(GameStatus.DRAW);
      expect(game.winner()).toBeNull();
    });
  });

  describe('remaining disks', () => {
    beforeEach(() => game.startGame(ADA, LINUS));

    it('starts both players at 21 and counts down as they play', () => {
      expect(game.remainingDisks(PlayerId.ONE)).toBe(21);
      expect(game.remainingDisks(PlayerId.TWO)).toBe(21);

      game.play(3);

      expect(game.remainingDisks(PlayerId.ONE)).toBe(20);
      expect(game.remainingDisks(PlayerId.TWO)).toBe(21);

      game.play(4);

      expect(game.remainingDisks(PlayerId.TWO)).toBe(20);
    });
  });

  describe('restarting', () => {
    beforeEach(() => game.startGame(ADA, LINUS));

    it('keeps the players but clears the board when restarting', () => {
      winColumnZeroForPlayerOne();

      game.restartWithSamePlayers();

      expect(game.players()).toEqual([
        { id: PlayerId.ONE, ...ADA },
        { id: PlayerId.TWO, ...LINUS },
      ]);
      expect(game.status()).toBe(GameStatus.PLAYING);
      expect(game.winner()).toBeNull();
      expect(game.currentPlayerId()).toBe(PlayerId.ONE);
      expect(
        board
          .board()
          .flat()
          .every((field) => field === Field.NONE),
      ).toBeTrue();
    });

    it('drops the players when changing them', () => {
      game.changePlayers();

      expect(game.isConfigured()).toBeFalse();
      expect(game.players()).toBeNull();
      expect(
        board
          .board()
          .flat()
          .every((field) => field === Field.NONE),
      ).toBeTrue();
    });
  });
});
