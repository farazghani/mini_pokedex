import { gql } from 'apollo-angular';

export const GET_TEAMS = gql`
  query GetTeams {
    allTeams {
      id
      trainer_id
      name
      pokemon_ids
      created_at
    }
  }
`;
