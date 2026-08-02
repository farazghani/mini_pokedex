import {
  DestroyRef,
  Injectable,
  inject,
} from '@angular/core';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { BehaviorSubject, finalize } from 'rxjs';
import { Observable } from 'rxjs';
import { TeamApiService } from '../services/team-api.services';
import { distinctUntilChanged, map } from 'rxjs/operators';

import {
  TeamState,
  initialTeamState,
} from './team.state';

import { Team } from '../models/team.model';

@Injectable({
  providedIn: 'root',
})
export class TeamStore {
  private readonly api = inject(TeamApiService);

  private readonly destroyRef = inject(DestroyRef);

  private readonly stateSubject =
    new BehaviorSubject<TeamState>(
      initialTeamState,
    );

  readonly state$ =
    this.stateSubject.asObservable();

    readonly teams$ = this.state$.pipe(
  map((state) => state.teams),
  distinctUntilChanged(),
);

readonly loading$ = this.state$.pipe(
  map((state) => state.loading),
  distinctUntilChanged(),
);

readonly error$ = this.state$.pipe(
  map((state) => state.error),
  distinctUntilChanged(),
);

readonly selectedTeamId$ = this.state$.pipe(
  map((state) => state.selectedTeamId),
  distinctUntilChanged(),
);
  /**
   * Load all teams.
   */
  loadTeams(): void {
    this.patchState({
      loading: true,
      error: null,
    });

    this.api
      .getTeams$()
      .pipe(
        finalize(() =>
          this.patchState({
            loading: false,
          }),
        ),

        takeUntilDestroyed(
          this.destroyRef,
        ),
      )
      .subscribe({
        next: (teams) =>
          this.patchState({
            teams,
          }),

        error: (error) =>
          this.patchState({
            error: error.message,
          }),
      });
  }

  /**
   * Optimistic create.
   */
createTeam(
  team: Omit<Team, 'id'>,
): Observable<void> {

  return new Observable<void>((observer) => {

    // Save current state for rollback
    const previousTeams =
      this.stateSubject.value.teams;

    // Optimistic team
    const optimisticTeam: Team = {
      ...team,
      id: Date.now(),
    };

    // Immediately show it
    this.patchState({
      teams: [
        optimisticTeam,
        ...previousTeams,
      ],
    });

    this.api
      .createTeam$(team)
      .pipe(
        takeUntilDestroyed(
          this.destroyRef,
        ),
      )
      .subscribe({

        next: (createdTeam) => {

          const updatedTeams =
            this.stateSubject.value.teams.map(
              (team) =>
                team.id === optimisticTeam.id
                  ? createdTeam
                  : team,
            );

          this.patchState({
            teams: updatedTeams,
          });

          observer.next();

          observer.complete();
        },

        error: (error) => {

          // Rollback
          this.patchState({
            teams: previousTeams,
            error: error.message,
          });

          observer.error(error);
        },
      });
  });
}

  /**
   * Delete team.
   */
  deleteTeam(
    id: number,
  ): void {
    const previousTeams =
      this.stateSubject.value.teams;

    this.patchState({
      teams:
        previousTeams.filter(
          (team) => team.id !== id,
        ),
    });

    this.api
      .deleteTeam$(id)
      .pipe(
        takeUntilDestroyed(
          this.destroyRef,
        ),
      )
      .subscribe({
        error: (error) =>
          this.patchState({
            teams: previousTeams,

            error: error.message,
          }),
      });
  }

  /**
   * Select team.
   */
  selectTeam(
    id: number | null,
  ): void {
    this.patchState({
      selectedTeamId: id,
    });
  }

  /**
   * Merge new state.
   */
  private patchState(
    state: Partial<TeamState>,
  ): void {
    this.stateSubject.next({
      ...this.stateSubject.value,

      ...state,
    });
  }
}