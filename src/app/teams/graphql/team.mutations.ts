import { gql } from 'apollo-angular';

export const CREATE_TEAM = gql`
  mutation CreateTeam(
    $team: TeamInput!
  ) {
    createTeam(team: $team) {
      id

      trainer_id

      name

      pokemon_ids

      created_at
    }
  }
`;

export const DELETE_TEAM = gql`
  mutation DeleteTeam(
    $id: ID!
  ) {
    deleteTeam(id: $id) {
      id
    }
  }
`;