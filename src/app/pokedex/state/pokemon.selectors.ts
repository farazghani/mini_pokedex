import { Injectable, inject } from '@angular/core';

import {
  combineLatest,
  distinctUntilChanged,
  map,
  shareReplay,
} from 'rxjs';

import { PokemonStore } from './pokemon.store';

@Injectable({
  providedIn: 'root',
})
export class PokemonSelectors {
  private readonly store =
    inject(PokemonStore);

  readonly state$ =
    this.store.state$;

  readonly loading$ =
    this.state$.pipe(
      map((state) => state.loading),

      distinctUntilChanged(),
    );

  readonly error$ =
    this.state$.pipe(
      map((state) => state.error),

      distinctUntilChanged(),
    );

  readonly filteredPokemon$ =
    this.state$.pipe(
      map((state) => {
        return state.pokemon.filter(
          (pokemon) => {
            const searchMatch =
              pokemon.name
                .toLowerCase()
                .includes(
                  state.search.toLowerCase(),
                );

            const typeMatch =
              !state.selectedType ||
              pokemon.types.some(
                (type) =>
                  type.name ===
                  state.selectedType,
              );

            return (
              searchMatch &&
              typeMatch
            );
          },
        );
      }),

      shareReplay(1),
    );

  readonly sortedPokemon$ =
    combineLatest([
      this.filteredPokemon$,
      this.state$,
    ]).pipe(
      map(([pokemon, state]) => {
        return [...pokemon].sort(
          (a, b) => {
            const direction =
              state.sortDirection ===
              'asc'
                ? 1
                : -1;

            const left =
              this.getValue(
                a,
                state.sortField,
              );

            const right =
              this.getValue(
                b,
                state.sortField,
              );

            if (left > right)
              return direction;

            if (left < right)
              return -direction;

            return 0;
          },
        );
      }),

      shareReplay(1),
    );

  readonly pagedPokemon$ =
    combineLatest([
      this.sortedPokemon$,
      this.state$,
    ]).pipe(
      map(([pokemon, state]) => {
        const start =
          state.pageIndex *
          state.pageSize;

        return pokemon.slice(
          start,
          start + state.pageSize,
        );
      }),

      shareReplay(1),
    );

  readonly selectedPokemon$ =
    combineLatest([
      this.state$,
      this.filteredPokemon$,
    ]).pipe(
      map(([state, pokemon]) =>
        pokemon.find(
          (item) =>
            item.id ===
            state.selectedPokemonId,
        ),
      ),

      shareReplay(1),
    );

  private getValue(
    pokemon: any,
    field: string,
  ): number | string {
    switch (field) {
      case 'name':
        return pokemon.name;

      case 'height':
        return pokemon.height;

      case 'weight':
        return pokemon.weight;

      default:
        return pokemon.id;
    }
  }
}