import { Routes } from '@angular/router';
import { SetupComponent } from './components/setup/setup.component';
import { GameWindowComponent } from './components/game-window/game-window.component';
import { gameConfiguredGuard } from './guards/game-configured.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'setup' },
  { path: 'setup', component: SetupComponent },
  { path: 'game', component: GameWindowComponent, canActivate: [gameConfiguredGuard] },
  { path: '**', redirectTo: 'setup' },
];
