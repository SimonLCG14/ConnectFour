import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { AddButtonComponent } from '../add-button/add-button.component';
import { FieldColumnComponent, Slot } from '../field-column/field-column.component';
import { BoardService } from '../../services/board.service';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-board',
  imports: [FieldColumnComponent, AddButtonComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardComponent {
  private readonly boardService = inject(BoardService);
  protected readonly game = inject(GameService);

  /** The column under the pointer, so the board can preview where a disk would land. */
  hoveredColumn = signal<number | null>(null);

  /**
   * The board rendered top-down, since it is stored bottom-up. Each slot carries its own row
   * so the winning line can be marked without the column having to invert anything, and its
   * place in that line so the win animation can stagger.
   */
  columns = computed<Slot[][]>(() => {
    const winning = this.game.winningLine();

    return this.boardService.board().map((column, columnIndex) =>
      column
        .map((field, row) => ({
          row,
          field,
          winningIndex: winning.findIndex(
            (cell) => cell.column === columnIndex && cell.row === row,
          ),
        }))
        .reverse(),
    );
  });

  colors = computed<[string, string]>(() => {
    const players = this.game.players();
    return players ? [players[0].color, players[1].color] : ['var(--red)', 'var(--yellow)'];
  });

  /** Whose colour the add buttons and the hover preview should wear. */
  turnColor = computed(() => this.game.currentPlayer()?.color ?? 'var(--ink)');

  isColumnPlayable(column: number): boolean {
    return !this.game.isOver() && !this.boardService.isColumnFull(column);
  }

  /** Where a disk would land in `column`, but only while it is hovered and playable. */
  ghostRow(column: number): number | null {
    if (this.hoveredColumn() !== column || !this.isColumnPlayable(column)) {
      return null;
    }

    return this.boardService.nextRow(column);
  }
}
