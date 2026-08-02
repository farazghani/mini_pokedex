import { inject, Injectable } from '@angular/core';

import { Team } from '../../models/team.model';
import { TeamApiService } from '../../services/team-api.services';

@Injectable({
  providedIn: 'root',
})
export class TeamService {
  private readonly api = inject(TeamApiService);

  getTeams() {
    return this.api.getTeams$();
  }

  createTeam(team: Omit<Team, 'id'>) {
    return this.api.createTeam$(team);
  }

  deleteTeam(id: number) {
    return this.api.deleteTeam$(id);
  }
}
