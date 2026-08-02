import { Injectable, inject } from '@angular/core';

import { Apollo } from 'apollo-angular';

import {
  Observable,
  catchError,
  map,
  retry,
  shareReplay,
  throwError,
} from 'rxjs';

import {
  CREATE_TEAM,
  DELETE_TEAM,
  GET_TEAMS,
} from '../graphql';

import {
  DeleteTeamResponse,
  TeamGraphQL,
  TeamMutationResponse,
  TeamQueryResponse,
} from '../models/graphql.model';

import { Team } from '../models/team.model';

@Injectable({
  providedIn: 'root',
})
export class TeamApiService {
  private readonly apollo = inject(Apollo);

  /**
   * Fetch all teams.
   */
  getTeams$(): Observable<Team[]> {
    return this.apollo
      .query<TeamQueryResponse>({
        query: GET_TEAMS,
        fetchPolicy: 'network-only',
      })
      .pipe(
        retry({
          count: 2,
          delay: 1000,
        }),

        map(({ data }) =>
          (data?.allTeams ?? []).map((team) =>
            this.mapTeam(team),
          ),
        ),

        shareReplay(1),

        catchError((error) => {
          console.error(error);

          return throwError(
            () => new Error('Unable to fetch teams.'),
          );
        }),
      );
  }

  /**
   * Create a team.
   */
  createTeam$(
    team: Omit<Team, 'id'>,
  ): Observable<Team> {
    return this.apollo
      .mutate<TeamMutationResponse>({
        mutation: CREATE_TEAM,

        variables: {
          trainerId: team.trainerId,
          name: team.name,
          pokemonIds: team.pokemonIds,
          createdAt: team.createdAt,
        },
      })
      .pipe(
        map(({ data }) => {
          if (!data) {
            throw new Error('Failed to create team.');
          }

          return this.mapTeam(data.createTeam);
        }),

        catchError((error) =>
          throwError(() => error),
        ),
      );
  }

  /**
   * Delete team.
   */
  deleteTeam$(
    id: number,
  ): Observable<number> {
    return this.apollo
      .mutate<DeleteTeamResponse>({
        mutation: DELETE_TEAM,

        variables: {
          id,
        },
      })
      .pipe(
        map(() => id),

        catchError((error) =>
          throwError(() => error),
        ),
      );
  }

  /**
   * GraphQL → app model.
   */
  private mapTeam(
    team: TeamGraphQL,
  ): Team {
    return {
      id: team.id,
      trainerId: team.trainer_id,
      name: team.name,
      pokemonIds: team.pokemon_ids,
      createdAt: team.created_at,
    };
  }
}
