import { inject, Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';

import { GET_TEAMS } from '../team.queries';
import { CREATE_TEAM , DELETE_TEAM } from '../team.mutations';
import { Team } from '../../models/team.model';

@Injectable({
  providedIn: 'root',
})
export class TeamService {
  private readonly apollo = inject(Apollo);

  getTeams() {
    return this.apollo.watchQuery<{ teams: Team[] }>({
      query: GET_TEAMS,
    }).valueChanges;
  }

  createTeam(team: Omit<Team, 'id'>) {
    return this.apollo.mutate<{
      createTeam: Team;
    }>({
      mutation: CREATE_TEAM,
      variables: {
        trainerId: team.trainerId,
        name: team.name,
        pokemonIds: team.pokemonIds,
        createdAt: team.createdAt,
      },
    });
  }

  deleteTeam(id: number) {
    return this.apollo.mutate({
      mutation: DELETE_TEAM,
      variables: {
        id,
      },
    });
  }
}
