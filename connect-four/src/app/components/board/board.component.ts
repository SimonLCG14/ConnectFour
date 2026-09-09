import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
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

  /**
   * The board rendered top-down, since it is stored bottom-up. Each slot carries its own row
   * so the winning line can be marked without the column having to invert anything.
   */
  columns = computed<Slot[][]>(() => {
    const winning = this.game.winningLine();

    return this.boardService.board().map((column, columnIndex) =>
      column
        .map((field, row) => ({
          row,
          field,
          winning: winning.some((cell) => cell.column === columnIndex && cell.row === row),
        }))
        .reverse(),
    );
  });

  colors = computed<[string, string]>(() => {
    const players = this.game.players();
    return players ? [players[0].color, players[1].color] : ['#3241b8', '#eb4034'];
  });

  isColumnPlayable(column: number): boolean {
    return !this.game.isOver() && !this.boardService.isColumnFull(column);
  }
}
