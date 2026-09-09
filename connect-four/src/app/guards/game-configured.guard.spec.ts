import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  provideRouter,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { gameConfiguredGuard } from './game-configured.guard';
import { GameService } from '../services/game.service';

describe('gameConfiguredGuard', () => {
  let game: GameService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    });
    game = TestBed.inject(GameService);
  });

  /** The guard is synchronous, so the async half of `GuardResult` never applies here. */
  function runGuard(): boolean | UrlTree {
    return TestBed.runInInjectionContext(() =>
      gameConfiguredGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
    ) as boolean | UrlTree;
  }

  it('sends you to the setup screen when no players are seated', () => {
    const result = runGuard();

    expect(result instanceof UrlTree).toBeTrue();
    expect((result as UrlTree).toString()).toBe('/setup');
  });

  it('lets you through once the game is configured', () => {
    game.startGame({ name: 'Ada', color: '#3241b8' }, { name: 'Linus', color: '#eb4034' });

    expect(runGuard()).toBeTrue();
  });
});
