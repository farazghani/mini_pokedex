import {
  DestroyRef,
  Injectable,
  inject,
} from '@angular/core';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { BehaviorSubject, finalize } from 'rxjs';

import { TeamApiService } from '../services/team-api.services';

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
  ): void {
    const temporaryTeam: Team = {
      ...team,

      id: Date.now(),
    };

    this.patchState({
      teams: [
        temporaryTeam,
        ...this.stateSubject.value.teams,
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
          const teams =
            this.stateSubject.value.teams.map(
              (current) =>
                current.id ===
                temporaryTeam.id
                  ? createdTeam
                  : current,
            );

          this.patchState({
            teams,
          });
        },

        error: (error) => {
          this.patchState({
            teams:
              this.stateSubject.value.teams.filter(
                (team) =>
                  team.id !==
                  temporaryTeam.id,
              ),

            error: error.message,
          });
        },
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