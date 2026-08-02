import { gql } from 'apollo-angular';

export const GET_TEAMS = gql`
  query GetTeams {
    teams {
      id
      trainer_id
      name
      pokemon_ids
      created_at
    }
  }
`;