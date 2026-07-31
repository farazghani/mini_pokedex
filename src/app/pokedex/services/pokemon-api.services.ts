import { Injectable, inject } from '@angular/core';
import { Apollo } from 'apollo-angular';

import {
  Observable,
  catchError,
  map,
  retry,
  shareReplay,
  throwError,
} from 'rxjs';

import { GET_POKEMON } from '../graphql/pokemon.queries';
import { Pokemon } from '../models/pokemon.model';

interface PokemonQueryResponse {
  pokemon_v2_pokemon: PokemonGraphQL[];
}

interface PokemonGraphQL {
  id: number;
  name: string;
  height: number;
  weight: number;

  pokemon_v2_pokemontypes: {
    pokemon_v2_type: {
      name: string;
    };
  }[];

  pokemon_v2_pokemonstats: {
    base_stat: number;

    pokemon_v2_stat: {
      name: string;
    };
  }[];

  pokemon_v2_pokemonsprites: {
    sprites: string;
  }[];
}

@Injectable({
  providedIn: 'root',
})
export class PokemonApiService {
  private readonly apollo = inject(Apollo);

  /**
   * Fetch paginated Pokémon.
   *
   * Retries twice before failing and shares
   * the response among multiple subscribers.
   */
  getPokemon$(
    limit = 20,
    offset = 0,
  ): Observable<Pokemon[]> {
    return this.apollo
      .watchQuery<PokemonQueryResponse>({
        query: GET_POKEMON,
        variables: {
          limit,
          offset,
        },
        fetchPolicy: 'cache-first',
      })
      .valueChanges.pipe(
        retry({
          count: 2,
          delay: 1000,
        }),

        map(({ data }) =>
          data.pokemon_v2_pokemon.map((pokemon) =>
            this.mapPokemon(pokemon),
          ),
        ),

        shareReplay(1),

        catchError((error: unknown) => {
          console.error('Pokemon API Error', error);

          return throwError(
            () => new Error('Unable to fetch Pokémon.'),
          );
        }),
      );
  }

  /**
   * Returns a single Pokémon from the
   * already-fetched page if available.
   */
  getPokemonById$(
    id: number,
    limit = 200,
  ): Observable<Pokemon | undefined> {
    return this.getPokemon$(limit, 0).pipe(
      map((pokemon) =>
        pokemon.find((item) => item.id === id),
      ),
    );
  }

  /**
   * Converts GraphQL response into the
   * application's model.
   */
  private mapPokemon(
    pokemon: PokemonGraphQL,
  ): Pokemon {
    return {
      id: pokemon.id,

      name: this.capitalize(pokemon.name),

      height: pokemon.height,

      weight: pokemon.weight,

      sprite: this.extractSprite(pokemon),

      types: pokemon.pokemon_v2_pokemontypes.map(
        (type) => ({
          name: type.pokemon_v2_type.name,
        }),
      ),

      stats: pokemon.pokemon_v2_pokemonstats.map(
        (stat) => ({
          name: stat.pokemon_v2_stat.name,
          baseStat: stat.base_stat,
        }),
      ),
    };
  }

  /**
   * Extract official artwork.
   */
  private extractSprite(
    pokemon: PokemonGraphQL,
  ): string {
    if (
      pokemon.pokemon_v2_pokemonsprites.length === 0
    ) {
      return '';
    }

    try {
      const sprite = JSON.parse(
        pokemon.pokemon_v2_pokemonsprites[0].sprites,
      );

      return (
        sprite.other?.['official-artwork']
          ?.front_default ??
        sprite.front_default ??
        ''
      );
    } catch {
      return '';
    }
  }

  /**
   * Capitalize Pokémon names.
   */
  private capitalize(
    value: string,
  ): string {
    if (!value.length) {
      return value;
    }

    return (
      value.charAt(0).toUpperCase() +
      value.slice(1)
    );
  }
}