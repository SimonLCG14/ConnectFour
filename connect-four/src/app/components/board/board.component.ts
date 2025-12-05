import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {DiskComponent} from '../disk/disk.component';
import {BoardService} from '../../services/board.service';
import {Field} from '../../model/field';
import {Player} from '../../model/player';

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
  boardService = inject(BoardService);
  protected readonly Field = Field;
  protected readonly Player = Player;
}
