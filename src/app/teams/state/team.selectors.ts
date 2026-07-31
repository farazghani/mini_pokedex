import { Injectable, inject } from '@angular/core';

import {
  combineLatest,
  distinctUntilChanged,
  map,
  shareReplay,
} from 'rxjs';

import { TeamStore } from './team.store';

@Injectable({
  providedIn: 'root',
})
export class TeamSelectors {
  private readonly store =
    inject(TeamStore);

  readonly state$ =
    this.store.state$;

  readonly teams$ =
    this.state$.pipe(
      map((state) => state.teams),

      distinctUntilChanged(),

      shareReplay(1),
    );

  readonly loading$ =
    this.state$.pipe(
      map((state) => state.loading),

      distinctUntilChanged(),
    );

  readonly error$ =
    this.state$.pipe(
      map((state) => state.error),

      distinctUntilChanged(),
    );

  readonly selectedTeam$ =
    combineLatest([
      this.teams$,
      this.state$,
    ]).pipe(
      map(([teams, state]) =>
        teams.find(
          (team) =>
            team.id ===
            state.selectedTeamId,
        ),
      ),

      shareReplay(1),
    );

  readonly teamCount$ =
    this.teams$.pipe(
      map((teams) => teams.length),

      distinctUntilChanged(),
    );
}