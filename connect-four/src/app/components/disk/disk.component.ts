import {Component, computed, input} from '@angular/core';
import {Disk} from '../../model/disk';

@Component({
  selector: 'app-disk',
  imports: [],
  templateUrl: './disk.component.html',
  styleUrl: './disk.component.scss',
})
export class DiskComponent {
  disk = input<Disk | null>(null);
}
