import { Team } from '../models/team.model';

export interface TeamState {
  teams: Team[];

  loading: boolean;

  error: string | null;

  selectedTeamId: number | null;
}

export const initialTeamState: TeamState = {
  teams: [],

  loading: false,

  error: null,

  selectedTeamId: null,
};