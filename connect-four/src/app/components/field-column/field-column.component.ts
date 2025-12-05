import {Component, input} from '@angular/core';
import {Field} from '../../model/field';
import {DiskComponent} from '../disk/disk.component';

@Component({
  selector: 'app-field-column',
  imports: [
    DiskComponent
  ],
  templateUrl: './field-column.component.html',
  styleUrl: './field-column.component.scss',
})
export class FieldColumnComponent {
  fields = input.required<Field[]>();
  protected readonly Field = Field;
}
