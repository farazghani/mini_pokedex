import {
  DestroyRef,
  Injectable,
  inject,
} from '@angular/core';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
  BehaviorSubject,
  Observable,
  catchError,
  defer,
  finalize,
  map,
  throwError,
} from 'rxjs';

import { TeamApiService } from '../services/team-api.services';
import { Team } from '../models/team.model';

import {
  TeamState,
  initialTeamState,
} from './team.state';

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
  );

  readonly loading$ = this.state$.pipe(
    map((state) => state.loading),
  );

  readonly error$ = this.state$.pipe(
    map((state) => state.error),
  );

  readonly selectedTeamId$ = this.state$.pipe(
    map((state) => state.selectedTeamId),
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
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (teams) => {
          const selectedTeamId =
            this.stateSubject.value.selectedTeamId;

          this.patchState({
            teams,
            selectedTeamId:
              selectedTeamId === null ||
              teams.some(
                (team) => team.id === selectedTeamId,
              )
                ? selectedTeamId
                : null,
          });
        },
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
  ): Observable<Team> {
    return defer(() => {
      const previousTeams =
        this.stateSubject.value.teams;
      const optimisticTeam: Team = {
        ...team,
        id: Date.now(),
      };
      const optimisticTeamId = optimisticTeam.id;

      this.patchState({
        error: null,
        teams: [optimisticTeam, ...previousTeams],
      });

      return this.api.createTeam$(team).pipe(
        map((createdTeam) => {
          if (optimisticTeamId === undefined) {
            return createdTeam;
          }

          this.patchState({
            teams: this.stateSubject.value.teams.map(
              (currentTeam) =>
                currentTeam.id === optimisticTeamId
                  ? createdTeam
                  : currentTeam,
            ),
          });

          return createdTeam;
        }),
        catchError((error) => {
          this.patchState({
            teams: previousTeams,
            error: error.message,
          });

          return throwError(() => error);
        }),
        takeUntilDestroyed(this.destroyRef),
      );
    });
  }

  /**
   * Delete team.
   */
  deleteTeam(id: number): void {
    const previousTeams =
      this.stateSubject.value.teams;
    const previousSelectedTeamId =
      this.stateSubject.value.selectedTeamId;

    this.patchState({
      teams: previousTeams.filter(
        (team) => team.id !== id,
      ),
      selectedTeamId:
        previousSelectedTeamId === id
          ? null
          : previousSelectedTeamId,
      error: null,
    });

    this.api
      .deleteTeam$(id)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        error: (error) =>
          this.patchState({
            teams: previousTeams,
            selectedTeamId: previousSelectedTeamId,
            error: error.message,
          }),
      });
  }

  /**
   * Select team.
   */
  selectTeam(id: number | null): void {
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
