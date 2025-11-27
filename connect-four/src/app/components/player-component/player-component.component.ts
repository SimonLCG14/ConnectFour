import {ChangeDetectionStrategy, Component, input} from '@angular/core';

@Component({
  selector: 'app-player-component',
  imports: [],
  templateUrl: './player-component.component.html',
  styleUrl: './player-component.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.--player-color]': 'color()',
  },
})
export class PlayerComponentComponent {
  color = input<string>('#f54542');
}
