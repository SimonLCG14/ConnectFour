import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BoardService } from './board.service';
import { Field } from '../model/field';

describe('BoardService', () => {
  let service: BoardService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
    service = TestBed.inject(BoardService);
  });

  /** Fills a column to the brim with one player's disks. */
  function fillColumn(column: number, field: Field = Field.PLAYER_ONE): void {
    for (let row = 0; row < service.ROWS; row++) {
      service.drop(column, field);
    }
  }

  describe('geometry', () => {
    it('starts as 7 columns of 6 empty fields', () => {
      expect(service.COLUMNS).toBe(7);
      expect(service.ROWS).toBe(6);

      const board = service.board();
      expect(board.length).toBe(7);
      for (const column of board) {
        expect(column.length).toBe(6);
        expect(column.every((field) => field === Field.NONE)).toBeTrue();
      }
    });

    it('empties a played board on reset', () => {
      service.drop(3, Field.PLAYER_ONE);
      service.reset();

      expect(
        service
          .board()
          .flat()
          .every((field) => field === Field.NONE),
      ).toBeTrue();
    });
  });

  describe('nextRow', () => {
    it('reports row 0 for an empty column', () => {
      expect(service.nextRow(3)).toBe(0);
    });

    it('reports the next free row of a partly filled column', () => {
      service.drop(3, Field.PLAYER_ONE);
      service.drop(3, Field.PLAYER_TWO);

      expect(service.nextRow(3)).toBe(2);
    });

    it('reports nothing for a full or out-of-range column', () => {
      fillColumn(3);

      expect(service.nextRow(3)).toBeNull();
      expect(service.nextRow(-1)).toBeNull();
      expect(service.nextRow(7)).toBeNull();
    });

    it('does not change the board', () => {
      const before = service.board();

      service.nextRow(3);

      expect(service.board()).toBe(before);
    });
  });

  describe('drop', () => {
    it('lands the first disk of a column on row 0', () => {
      expect(service.drop(3, Field.PLAYER_ONE)).toBe(0);
      expect(service.board()[3][0]).toBe(Field.PLAYER_ONE);
    });

    it('stacks the next disk of the same column on row 1', () => {
      service.drop(3, Field.PLAYER_ONE);

      expect(service.drop(3, Field.PLAYER_TWO)).toBe(1);
      expect(service.board()[3][1]).toBe(Field.PLAYER_TWO);
    });

    it('rejects a full column and leaves the board untouched', () => {
      fillColumn(2);
      const before = service.board();

      expect(service.drop(2, Field.PLAYER_TWO)).toBeNull();
      expect(service.board()).toBe(before);
    });

    it('rejects an out-of-range column', () => {
      expect(service.drop(-1, Field.PLAYER_ONE)).toBeNull();
      expect(service.drop(7, Field.PLAYER_ONE)).toBeNull();
    });

    it('replaces the board and the touched column rather than mutating them', () => {
      const before = service.board();
      const untouchedColumn = before[5];

      service.drop(3, Field.PLAYER_ONE);

      // Zoneless change detection only reacts to a new reference.
      expect(service.board()).not.toBe(before);
      expect(service.board()[3]).not.toBe(before[3]);
      // Columns nobody played into can be shared.
      expect(service.board()[5]).toBe(untouchedColumn);
      // The old snapshot must not have been written through.
      expect(before[3][0]).toBe(Field.NONE);
    });
  });

  describe('findWinningLine', () => {
    it('finds a vertical four', () => {
      for (let i = 0; i < 3; i++) {
        service.drop(1, Field.PLAYER_ONE);
      }
      const row = service.drop(1, Field.PLAYER_ONE)!;

      const line = service.findWinningLine(1, row);

      expect(line).not.toBeNull();
      expect(line!.length).toBe(4);
      expect(line).toContain({ column: 1, row: 0 });
      expect(line).toContain({ column: 1, row: 3 });
    });

    it('finds a horizontal four', () => {
      for (const column of [0, 1, 2]) {
        service.drop(column, Field.PLAYER_TWO);
      }
      const row = service.drop(3, Field.PLAYER_TWO)!;

      const line = service.findWinningLine(3, row);

      expect(line).not.toBeNull();
      expect(line!.length).toBe(4);
    });

    it('finds a diagonal four going up to the right', () => {
      // Staircase: column n carries n filler disks, then the winning disk on top.
      for (let column = 0; column < 4; column++) {
        for (let filler = 0; filler < column; filler++) {
          service.drop(column, Field.PLAYER_TWO);
        }
        service.drop(column, Field.PLAYER_ONE);
      }

      const line = service.findWinningLine(3, 3);

      expect(line).not.toBeNull();
      expect(line!.length).toBe(4);
    });

    it('finds a diagonal four going down to the right', () => {
      // Mirror staircase: column n carries (3 - n) filler disks.
      for (let column = 0; column < 4; column++) {
        for (let filler = 0; filler < 3 - column; filler++) {
          service.drop(column, Field.PLAYER_TWO);
        }
        service.drop(column, Field.PLAYER_ONE);
      }

      const line = service.findWinningLine(0, 3);

      expect(line).not.toBeNull();
      expect(line!.length).toBe(4);
    });

    it('does not call three in a row a win', () => {
      service.drop(1, Field.PLAYER_ONE);
      service.drop(1, Field.PLAYER_ONE);
      const row = service.drop(1, Field.PLAYER_ONE)!;

      expect(service.findWinningLine(1, row)).toBeNull();
    });

    it('reports every cell of a run longer than four', () => {
      for (const column of [0, 1, 2, 4]) {
        service.drop(column, Field.PLAYER_ONE);
      }
      // Played last, joining 0-1-2 with 4 into a five-long run.
      const row = service.drop(3, Field.PLAYER_ONE)!;

      const line = service.findWinningLine(3, row);

      expect(line).not.toBeNull();
      expect(line!.length).toBe(5);
    });

    it('does not combine both players into a line', () => {
      service.drop(0, Field.PLAYER_ONE);
      service.drop(1, Field.PLAYER_ONE);
      service.drop(2, Field.PLAYER_TWO);
      const row = service.drop(3, Field.PLAYER_ONE)!;

      expect(service.findWinningLine(3, row)).toBeNull();
    });
  });

  describe('fullness', () => {
    it('reports a single full column', () => {
      expect(service.isColumnFull(4)).toBeFalse();

      fillColumn(4);

      expect(service.isColumnFull(4)).toBeTrue();
    });

    it('is only full once every slot is taken', () => {
      for (let column = 0; column < service.COLUMNS - 1; column++) {
        fillColumn(column);
      }

      expect(service.isFull()).toBeFalse();

      fillColumn(service.COLUMNS - 1);

      expect(service.isFull()).toBeTrue();
    });
  });
});
