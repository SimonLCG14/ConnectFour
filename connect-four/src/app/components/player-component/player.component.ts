import {ChangeDetectionStrategy, Component, computed, input, OnInit, signal} from '@angular/core';
import {Disk} from '../../model/disk';
import {DiskComponent} from '../disk/disk.component';

@Component({
  selector: 'app-player',
  imports: [
    DiskComponent
  ],
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.--player-color]': 'color()'
  },
})
export class PlayerComponent implements OnInit{
  private readonly AMOUNT_OF_DISKS: number = 21;

  color = input<string>('#f54542');
  hasTurn = input<boolean>(true);
  playerName = input<string>('No name');

  remainingDisks = signal<Disk[]>([]);

  amountOfDisks = computed(() => this.remainingDisks().length);

  ngOnInit() {
    for (let i = 0; i < this.AMOUNT_OF_DISKS; i++){
      this.remainingDisks().push({color: this.color()});
    }
  }
}
