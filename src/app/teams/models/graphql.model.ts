export interface TeamQueryResponse {
  teams?: TeamGraphQL[];
}

export interface TeamMutationResponse {
  createTeam: TeamGraphQL;
}

export interface DeleteTeamResponse {
  deleteTeam: {
    id: number;
  };
}

export interface TeamGraphQL {
  id: number;

  trainer_id: number;

  name: string;

  pokemon_ids: number[];

  created_at: string;
}