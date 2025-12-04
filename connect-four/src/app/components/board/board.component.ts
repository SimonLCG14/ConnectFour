import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {Disk, getNextId} from '../../model/disk';
import {Board, Row} from '../../model/board';
import {DiskComponent} from '../disk/disk.component';

@Component({
  selector: 'app-board',
  imports: [
    DiskComponent
  ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardComponent {
  private readonly BOARD_COLUMNS: number = 7;
  private readonly BOARD_ROWS: number = 6;

  board = signal<Board>(this.generateEmptyBoard());

  private generateEmptyBoard(): Board {
    const result = [];
    const disk: Disk = {id: -1, color: '#bf2323'};

    for(let i = 0; i < this.BOARD_ROWS; i++){
      const row = [];

      for(let j = 0; j < this.BOARD_COLUMNS; j++){
        row.push(disk);
      }
      result.push(row);
    }

    return result as Board;
  }

  private addDisk(col: number, color: string, id: number){
    if(col > this.BOARD_COLUMNS || col < 0){
      alert("Column is invalid.");
    }
    if(!(this.board()[col].length === this.BOARD_ROWS)){
      this.board()[col].push({ color: color, id: id})
    }
  }
}
