import { TestBed } from '@angular/core/testing';
import {
  Observable,
  of,
  throwError,
} from 'rxjs';

import { TeamApiService } from '../services/team-api.services';
import { TeamStore } from './team.store';
import { Team } from '../models/team.model';
import { initialTeamState, TeamState } from './team.state';

describe('TeamStore', () => {
  const existingTeams: Team[] = [
    {
      id: 1,
      trainerId: 1,
      name: 'Kanto Starters',
      pokemonIds: [25, 6, 9],
      createdAt: '2024-01-15T10:00:00Z',
    },
  ];

  let apiMock: {
    getTeams$: () => Observable<Team[]>;
    createTeam$: (
      team: Omit<Team, 'id'>,
    ) => Observable<Team>;
    deleteTeam$: (
      id: number,
    ) => Observable<number>;
  };

  let store: TeamStore;

  beforeEach(() => {
    apiMock = {
      getTeams$: () => of(existingTeams),
      createTeam$: (_team) =>
        throwError(() => new Error('boom')),
      deleteTeam$: (_id) => of(1),
    };

    TestBed.configureTestingModule({
      providers: [
        TeamStore,
        {
          provide: TeamApiService,
          useValue: apiMock,
        },
      ],
    });

    store = TestBed.inject(TeamStore);
    (store as unknown as { stateSubject: { next: (state: TeamState) => void } })
      .stateSubject.next({
        ...initialTeamState,
        teams: existingTeams,
      });
  });

  it('rolls back the optimistic team insert when createTeam fails', () => {
    const emittedTeams: Team[][] = [];

    const subscription = store.teams$.subscribe((teams) => {
      emittedTeams.push(teams);
    });

    let caughtError: string | null = null;

    store.createTeam({
      trainerId: 1,
      name: 'New Team',
      pokemonIds: [1, 4, 7],
      createdAt: '2024-08-02T00:00:00Z',
    }).subscribe({
      error: (error) => {
        caughtError = error.message;
      },
    });

    expect(caughtError).toBe('boom');
    expect(
      emittedTeams[emittedTeams.length - 1],
    ).toEqual(existingTeams);

    subscription.unsubscribe();
  });
});
