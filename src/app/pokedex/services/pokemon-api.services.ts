import { Injectable, inject } from '@angular/core';

import { Apollo } from 'apollo-angular';
import { Pokemon } from '../models/pokemon.model';
import { PokemonAbility } from '../models/pokemon-ability.model';


import {
  Observable,
  catchError,
  map,
  retry,
  shareReplay,
  throwError,
} from 'rxjs';

import {
  GET_POKEMON,
  GET_POKEMON_ABILITIES,
} from '../graphql';

import {
  AbilityQueryResponse,
  PokemonGraphQL,
  PokemonQueryResponse,
} from '../models/graphql.model';


@Injectable({
  providedIn: 'root',
})
export class PokemonApiService {
  private readonly apollo = inject(Apollo);

  /**
   * Fetch paginated Pokémon.
   */
  getPokemon$(
    limit = 20,
    offset = 0,
  ): Observable<Pokemon[]> {
    return this.apollo
      .query<PokemonQueryResponse>({
        query: GET_POKEMON,
        variables: {
          limit,
          offset,
        },
        fetchPolicy: 'cache-first',
        errorPolicy: 'all',
      })
      .pipe(
        retry({
          count: 2,
          delay: 1000,
        }),

        map(({ data }) =>
          (data?.pokemon_v2_pokemon ?? []).map((pokemon) =>
            this.mapPokemon(pokemon),
          ),
        ),

        shareReplay(1),

        catchError((error) => {
          console.error(error);

          return throwError(
            () => new Error('Unable to fetch Pokémon.'),
          );
        }),
      );
  }

  /**
   * Fetch abilities for one Pokémon.
   */
  getPokemonAbilities$(
    pokemonId: number,
  ): Observable<PokemonAbility[]> {
    return this.apollo
      .query<AbilityQueryResponse>({
        query: GET_POKEMON_ABILITIES,
        variables: {
          pokemonId,
        },
      })
      .pipe(
        retry({
          count: 2,
          delay: 1000,
        }),

        map(({ data }) =>
          (data?.pokemon_v2_pokemonability ?? []).map((ability) => ({
            name: ability.pokemon_v2_ability.name,

            shortEffect:
              ability.pokemon_v2_ability
                .pokemon_v2_abilityeffecttexts[0]?.short_effect ??
              '',

            isHidden: ability.is_hidden,
          })),
        ),

        catchError((error) =>
          throwError(() => error),
        ),
      );
  }

  /**
   * Find a Pokémon from the current page.
   */
  getPokemonById$(
    id: number,
    limit = 200,
  ): Observable<Pokemon | undefined> {
    return this.getPokemon$(limit).pipe(
      map((pokemon) =>
        pokemon.find((item) => item.id === id),
      ),
    );
  }

  /**
   * Convert GraphQL model into app model.
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

      stats: pokemon.pokemon_v2_pokemonstats.map((stat) => ({
        name: stat.pokemon_v2_stat.name,

        baseStat: stat.base_stat,
      })),

      types: pokemon.pokemon_v2_pokemontypes.map((type) => ({
        name: type.pokemon_v2_type.name,
      })),
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
   * Capitalize names.
   */
  private capitalize(
    value: string,
  ): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}