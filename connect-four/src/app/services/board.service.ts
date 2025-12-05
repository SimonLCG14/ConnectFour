import {Injectable, signal} from '@angular/core';
import {Field} from '../model/field';
import {Player} from '../model/player';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  private readonly BOARD_HEIGHT: number = 7;
  private readonly BOARD_POSITIONS: number = 6;

  board = signal<Field[][]>(this.generateEmptyBoard());

  private generateEmptyBoard(): Field[][]{
    const result: Field[][] = [];

    for(let i: number = 0; i < this.BOARD_POSITIONS; i++){
      result.push([]);

      for(let j: number = 0; j < this.BOARD_HEIGHT; j++){
        result.at(i)?.push(Field.NONE);
      }
    }
    console.log(result);

    return result;
  }

  public addDisk(position: number, player: Player){
    if (position < 0 || position >= this.board().length) {
      console.warn("Invalid position");
      alert("Invalid position");
      return;
    }

    if(this.board().at(position)!.at(this.BOARD_HEIGHT - 1)! !== Field.NONE){
      console.warn("Position full");
      alert("Position full");
      return;
    }

    this.board.update((currentBoard) => {
      const targetCol = currentBoard[position];
      let targetRowIndex = -1;

      for (let i = 0; i < this.BOARD_HEIGHT; i++) {
        if (targetCol[i] === Field.NONE) {
          targetRowIndex = i;
          break;
        }
      }

      if (targetRowIndex === -1) {
        return currentBoard;
      }
      const newBoard = [...currentBoard];

      const newColumn = [...newBoard[position]];

      newColumn[targetRowIndex] = (player === Player.RED_PLAYER) ? Field.RED : Field.BLUE;
      newBoard[position] = newColumn;

      return newBoard;
    });

    console.log(this.board())
  }

}
