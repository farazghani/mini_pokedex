import { TestBed } from '@angular/core/testing';
import { BehaviorSubject, firstValueFrom } from 'rxjs';

import { TeamSelectors } from './team.selectors';
import { TeamStore } from './team.store';
import { TeamState, initialTeamState } from './team.state';

describe('TeamSelectors', () => {
  it('computes the team count from state', async () => {
    const stateSubject = new BehaviorSubject<TeamState>({
      ...initialTeamState,
      teams: [
        {
          id: 1,
          trainerId: 1,
          name: 'Kanto Starters',
          pokemonIds: [25, 6, 9],
          createdAt: '2024-01-15T10:00:00Z',
        },
        {
          id: 2,
          trainerId: 2,
          name: 'Water Specialists',
          pokemonIds: [121, 130, 134],
          createdAt: '2024-02-10T09:00:00Z',
        },
      ],
    });

    TestBed.configureTestingModule({
      providers: [
        TeamSelectors,
        {
          provide: TeamStore,
          useValue: {
            state$: stateSubject.asObservable(),
          },
        },
      ],
    });

    const selectors = TestBed.inject(TeamSelectors);

    await expect(
      firstValueFrom(selectors.teamCount$),
    ).resolves.toBe(2);
  });
});
