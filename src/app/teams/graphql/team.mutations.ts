import { gql } from 'apollo-angular';

export const CREATE_TEAM = gql`
  mutation CreateTeam(
    $trainerId: ID!
    $name: String!
    $pokemonIds: [Int]!
    $createdAt: String!
  ) {
    createTeam(
      trainer_id: $trainerId
      name: $name
      pokemon_ids: $pokemonIds
      created_at: $createdAt
    ) {
      id
      trainer_id
      name
      pokemon_ids
      created_at
    }
  }
`;

export const DELETE_TEAM = gql`
  mutation DeleteTeam($id: ID!) {
    deleteTeam(id: $id) {
      id
    }
  }
`;