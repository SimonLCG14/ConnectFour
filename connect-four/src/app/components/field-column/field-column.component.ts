import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Field } from '../../model/field';
import { DiskComponent } from '../disk/disk.component';

/** One rendered slot, top-down, as prepared by {@link BoardComponent}. */
export interface Slot {
  row: number;
  field: Field;
  winning: boolean;
}

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

  protected readonly Field = Field;

  colorFor(field: Field): string {
    return field === Field.PLAYER_ONE ? this.colors()[0] : this.colors()[1];
  }
}
