import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {Disk} from '../../model/disk';

@Component({
  selector: 'app-board',
  imports: [],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardComponent {
  private readonly BOARD_COLUMNS: number = 7;
  private readonly BOARD_ROWS: number = 6;

  board = signal<Disk[][]>(this.generateEmptyBoard());

  private generateEmptyBoard(): Disk[][]{
    const board: Disk[][] = [];

    for (let r = 0; r < this.BOARD_ROWS; r++) {
      const row: Disk[] = [];
      for (let c = 0; c < this.BOARD_COLUMNS; c++) {
        row.push({
          id: 0,
          color: 'empty'
        });
      }
      board.push(row);
    }
    return board;
  }
}
