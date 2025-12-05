import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {DiskComponent} from '../disk/disk.component';
import {BoardService} from '../../services/board.service';
import {Field} from '../../model/field';
import {Player} from '../../model/player';
import {FieldColumnComponent} from '../field-column/field-column.component';
import {NgOptimizedImage} from '@angular/common';
import {AddButtonComponent} from '../add-button/add-button.component';

@Component({
  selector: 'app-board',
  imports: [
    DiskComponent,
    FieldColumnComponent,
    NgOptimizedImage,
    AddButtonComponent
  ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardComponent {
  boardService = inject(BoardService);
  protected readonly Field = Field;
  protected readonly Player = Player;
  reversedBoard = computed(() => {
    return [...this.boardService.board()].map(row => [...row].reverse());
  })
}
