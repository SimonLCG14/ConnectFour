import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { SetupComponent } from './setup.component';
import { GameService } from '../../services/game.service';

describe('SetupComponent', () => {
  let fixture: ComponentFixture<SetupComponent>;
  let component: SetupComponent;
  let game: GameService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetupComponent],
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(SetupComponent);
    component = fixture.componentInstance;
    game = TestBed.inject(GameService);
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
  });

  describe('canStart', () => {
    it('is true for two named players with different colours', () => {
      expect(component.canStart()).toBeTrue();
    });

    it('is false while either name is blank', () => {
      component.playerOneName.set('   ');
      expect(component.canStart()).toBeFalse();

      component.playerOneName.set('Ada');
      component.playerTwoName.set('');
      expect(component.canStart()).toBeFalse();
    });

    it('is false while both players share a colour', () => {
      component.playerTwoColor.set(component.playerOneColor().toUpperCase());

      expect(component.canStart()).toBeFalse();
    });
  });

  describe('start', () => {
    it('seats the trimmed players and opens the game', () => {
      component.playerOneName.set('  Ada  ');
      component.playerTwoName.set('Linus');
      component.playerOneColor.set('#112233');
      component.playerTwoColor.set('#445566');

      component.start();

      expect(game.players()).toEqual([
        { id: 0, name: 'Ada', color: '#112233' },
        { id: 1, name: 'Linus', color: '#445566' },
      ]);
      expect(router.navigate).toHaveBeenCalledWith(['/game']);
    });

    it('does nothing when the form is incomplete', () => {
      component.playerTwoName.set('');

      component.start();

      expect(game.isConfigured()).toBeFalse();
      expect(router.navigate).not.toHaveBeenCalled();
    });
  });
});
