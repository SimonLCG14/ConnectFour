import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { GameService } from '../services/game.service';

/** Keeps `/game` unreachable until the setup screen has seated two players. */
export const gameConfiguredGuard: CanActivateFn = () => {
  const game = inject(GameService);
  const router = inject(Router);

  return game.isConfigured() || router.createUrlTree(['/setup']);
};
