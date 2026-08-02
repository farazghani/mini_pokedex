import { FormControl, ValidationErrors } from '@angular/forms';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BehaviorSubject, Observable } from 'rxjs';

import { uniqueTeamNameValidator } from './unique-team-name.validator';
import { TeamStore } from '../state/team.store';
import { Team } from '../models/team.model';

describe('uniqueTeamNameValidator', () => {
  it('marks duplicate team names as invalid', fakeAsync(() => {
    const teams$ = new BehaviorSubject<Team[]>([
      {
        id: 1,
        trainerId: 1,
        name: 'Kanto Starters',
        pokemonIds: [25, 6, 9],
        createdAt: '2024-01-15T10:00:00Z',
      },
    ]);

    TestBed.configureTestingModule({
      providers: [
        {
          provide: TeamStore,
          useValue: {
            teams$: teams$.asObservable(),
          },
        },
      ],
    });

    const validator = uniqueTeamNameValidator(
      TestBed.inject(TeamStore),
    );
    const control = new FormControl('kanto starters');
    let result: Record<string, unknown> | null | undefined;

    (validator(control) as Observable<ValidationErrors | null>).subscribe((value) => {
      result = value;
    });

    tick(300);

    expect(result).toEqual({
      teamExists: true,
    });
  }));
});
