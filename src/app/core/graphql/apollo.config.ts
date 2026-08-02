import { inject } from '@angular/core';
import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
} from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';

const POKEMON_GRAPHQL_URL =
  'https://beta.pokeapi.co/graphql/v1beta';

const TEAM_GRAPHQL_URL = 'http://127.0.0.1:4000/';

const POKEMON_OPERATION_NAMES = new Set([
  'GetPokemon',
  'GetAbilities',
]);

function isPokemonOperation(operation: {
  operationName?: string | null;
}): boolean {
  return POKEMON_OPERATION_NAMES.has(
    operation.operationName ?? '',
  );
}

export function createApollo(): ApolloClient.Options {
  const httpLink = inject(HttpLink);

  const pokemonLink = httpLink.create({
    uri: POKEMON_GRAPHQL_URL,
  });

  const teamLink = httpLink.create({
    uri: TEAM_GRAPHQL_URL,
  });

  return {
    link: ApolloLink.split(
      isPokemonOperation,
      pokemonLink,
      teamLink,
    ),
    cache: new InMemoryCache(),
  };
}
