import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Field } from '../../model/field';
import { DiskComponent } from '../disk/disk.component';

/** One rendered slot, top-down, as prepared by `BoardComponent`. */
export interface Slot {
  row: number;
  field: Field;
  /** Position in the winning line, or -1 when this slot is not part of one. */
  winningIndex: number;
}

/** Base fall time for a one-slot drop; longer falls scale with the square root of the distance. */
const FALL_MS = 190;

@Component({
  selector: 'app-field-column',
  imports: [DiskComponent],
  templateUrl: './field-column.component.html',
  styleUrl: './field-column.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldColumnComponent {
  slots = input.required<Slot[]>();
  /** Disk colours, indexed by `PlayerId`. */
  colors = input.required<[string, string]>();
  /** Row to preview a disk in while this column is hovered, if any. */
  ghostRow = input<number | null>(null);
  ghostColor = input<string>('');

  protected readonly Field = Field;

  colorFor(field: Field): string {
    return field === Field.PLAYER_ONE ? this.colors()[0] : this.colors()[1];
  }

  /** Falling under gravity, time goes with the square root of the height. */
  fallMs(slotsFallen: number): number {
    return Math.round(FALL_MS * Math.sqrt(slotsFallen));
  }
}
