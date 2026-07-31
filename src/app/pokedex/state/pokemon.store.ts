import { DestroyRef, Injectable, inject } from '@angular/core';

import {
  BehaviorSubject,
  Subject,
  debounceTime,
  distinctUntilChanged,
  finalize,
  map,
  of,
  switchMap,
} from 'rxjs';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { PokemonApiService } from '../services/pokemon-api.services';

import {
  PokemonState,
  initialPokemonState,
} from './pokemon.state';

@Injectable({
  providedIn: 'root',
})
export class PokemonStore {
  private readonly api = inject(PokemonApiService);

  private readonly destroyRef = inject(DestroyRef);

  private readonly stateSubject =
    new BehaviorSubject<PokemonState>(
      initialPokemonState,
    );

  readonly state$ =
    this.stateSubject.asObservable();

  private readonly searchRequests$ =
    new Subject<string>();

  constructor() {
    this.initializeSearch();
  }

  /**
   * Load Pokémon from API.
   */
  loadPokemon(): void {
    this.patchState({
      loading: true,
      error: null,
    });

    this.api
      .getPokemon$(200)
      .pipe(
        finalize(() =>
          this.patchState({
            loading: false,
          }),
        ),

        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (pokemon) =>
          this.patchState({
            pokemon,
          }),

        error: (error) =>
          this.patchState({
            error: error.message,
          }),
      });
  }

  /**
   * Search command.
   */
  search(
    value: string,
  ): void {
    this.searchRequests$.next(value);
  }

  private initializeSearch(): void {
  this.searchRequests$
    .pipe(
      debounceTime(300),

      distinctUntilChanged(),

      switchMap((search) =>
        of(search).pipe(
          map((value) => value.trim()),
        ),
      ),

      takeUntilDestroyed(this.destroyRef),
    )
    .subscribe((search) => {
      this.patchState({
        search,
        pageIndex: 0,
      });
    });
}

  setSelectedPokemon(
    id: number | null,
  ): void {
    this.patchState({
      selectedPokemonId: id,
    });
  }

  setType(
    type: string | null,
  ): void {
    this.patchState({
      selectedType: type,
    });
  }

  setSort(
    field: string,
    direction: 'asc' | 'desc',
  ): void {
    this.patchState({
      sortField: field,
      sortDirection: direction,
    });
  }

  setPagination(
    pageIndex: number,
    pageSize: number,
  ): void {
    this.patchState({
      pageIndex,
      pageSize,
    });
  }

  private patchState(
    state: Partial<PokemonState>,
  ): void {
    this.stateSubject.next({
      ...this.stateSubject.value,
      ...state,
    });
  }
}