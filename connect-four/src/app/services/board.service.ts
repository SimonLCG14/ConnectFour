import { Injectable, signal } from '@angular/core';
import { Cell } from '../model/cell';
import { Field } from '../model/field';

/** The four axes a run of four can lie on, expressed as a column/row step. */
const DIRECTIONS: readonly Cell[] = [
  { column: 1, row: 0 }, // horizontal
  { column: 0, row: 1 }, // vertical
  { column: 1, row: 1 }, // diagonal, up to the right
  { column: 1, row: -1 }, // diagonal, down to the right
];

const LINE_LENGTH = 4;

/**
 * Owns the grid and the rules that operate on it, and nothing else — whose turn it is and
 * whether the game is over live in `GameService`.
 *
 * The board is stored column-major and bottom-up: `board()[column][row]`, where row 0 is the
 * lowest slot a disk falls into.
 */
@Injectable({
  providedIn: 'root',
})
export class BoardService {
  readonly COLUMNS = 7;
  readonly ROWS = 6;

  board = signal<Field[][]>(this.generateEmptyBoard());

  /**
   * Drops a disk into `column`, returning the row it lands on, or `null` when the column is
   * out of range or already full.
   */
  drop(column: number, field: Field): number | null {
    if (!this.isValidColumn(column) || this.isColumnFull(column)) {
      return null;
    }

    const row = this.board()[column].indexOf(Field.NONE);

    this.board.update((currentBoard) => {
      // Replace the board and the touched column instead of mutating them, so zoneless
      // change detection sees a new reference.
      const newBoard = [...currentBoard];
      const newColumn = [...newBoard[column]];

      newColumn[row] = field;
      newBoard[column] = newColumn;

      return newBoard;
    });

    return row;
  }

  /**
   * Returns every cell of the run through the disk at (`column`, `row`), or `null` when no run
   * through it reaches four. Scanning outward from the last move is enough — a line can only
   * be completed by the disk that was just played.
   */
  findWinningLine(column: number, row: number): Cell[] | null {
    const field = this.board()[column][row];

    if (field === Field.NONE) {
      return null;
    }

    for (const direction of DIRECTIONS) {
      const line = [
        ...this.walk(column, row, field, -direction.column, -direction.row).reverse(),
        { column, row },
        ...this.walk(column, row, field, direction.column, direction.row),
      ];

      if (line.length >= LINE_LENGTH) {
        return line;
      }
    }

    return null;
  }

  isColumnFull(column: number): boolean {
    return !this.board()[column].includes(Field.NONE);
  }

  isFull(): boolean {
    return this.board().every((column) => !column.includes(Field.NONE));
  }

  reset(): void {
    this.board.set(this.generateEmptyBoard());
  }

  /** Collects the matching disks running away from (`column`, `row`) in one direction. */
  private walk(
    column: number,
    row: number,
    field: Field,
    columnStep: number,
    rowStep: number,
  ): Cell[] {
    const cells: Cell[] = [];

    let nextColumn = column + columnStep;
    let nextRow = row + rowStep;

    while (this.isOnBoard(nextColumn, nextRow) && this.board()[nextColumn][nextRow] === field) {
      cells.push({ column: nextColumn, row: nextRow });
      nextColumn += columnStep;
      nextRow += rowStep;
    }

    return cells;
  }

  private isValidColumn(column: number): boolean {
    return Number.isInteger(column) && column >= 0 && column < this.COLUMNS;
  }

  private isOnBoard(column: number, row: number): boolean {
    return this.isValidColumn(column) && row >= 0 && row < this.ROWS;
  }

  private generateEmptyBoard(): Field[][] {
    return Array.from({ length: this.COLUMNS }, () =>
      Array.from({ length: this.ROWS }, () => Field.NONE),
    );
  }
}
