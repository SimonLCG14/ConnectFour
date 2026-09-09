import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Disk } from '../../model/disk';
import { Player } from '../../model/player';
import { DiskComponent } from '../disk/disk.component';

@Component({
  selector: 'app-player',
  imports: [DiskComponent],
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerComponent {
  player = input.required<Player>();
  remainingDisks = input.required<number>();
  hasTurn = input<boolean>(false);

  /** The pile is a view of the count, so it can never drift out of step with the board. */
  disks = computed<Disk[]>(() =>
    Array.from({ length: this.remainingDisks() }, () => ({ color: this.player().color })),
  );
}
