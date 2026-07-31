import {
  ApolloClient,
  InMemoryCache,
} from '@apollo/client/core';
import { inject } from '@angular/core';

import { HttpLink } from 'apollo-angular/http';

export function createApollo(): ApolloClient.Options{
  const httpLink = inject(HttpLink);

  return {
    link: httpLink.create({
      uri: 'https://beta.pokeapi.co/graphql/v1beta',
    }),
    cache: new InMemoryCache(),
  };
}