import {ChangeDetectionStrategy, Component, input, OnInit, signal} from '@angular/core';
import {Disk} from '../../model/disk';

@Component({
  selector: 'app-player-component',
  imports: [],
  templateUrl: './player-component.component.html',
  styleUrl: './player-component.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.--player-color]': 'color()'
  },
})
export class PlayerComponentComponent implements OnInit{
  private readonly AMOUNT_OF_DISKS: number = 21;

  color = input<string>('#f54542');
  hasTurn = input<boolean>(true);
  playerName = input<string>('No name');

  remainingDisks = signal<Disk[]>([]);

  ngOnInit() {
    for (let i = 0; i < this.AMOUNT_OF_DISKS; i++){
      this.remainingDisks().push({id: i, color: this.color()});
    }
  }
}
