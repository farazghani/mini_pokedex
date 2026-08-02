import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { Sort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { MatSidenavModule } from '@angular/material/sidenav';

import { PokemonStore } from '../state/pokemon.store';
import { PokemonSelectors } from '../state/pokemon.selectors';
import { PokemonTableComponent } from '../components/pokemon-table/pokemon-table';
import { SearchBarComponent } from '../components/search-bar/search-bar.component';
import { TypeFilterComponent } from '../components/type-filter/type-filter.component';
import { PokemonDetailComponent } from '../components/pokemon-detail/pokemon-detail.component';

@Component({
  selector: 'app-pokedex-page',
  standalone: true,
  imports: [
    CommonModule,
    PokemonTableComponent,
    SearchBarComponent,
    TypeFilterComponent,
    MatSidenavModule,
    PokemonDetailComponent,
  ],
  templateUrl: './pokedex-page.component.html',
  styleUrl: './pokedex-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokedexPageComponent implements OnInit {
  private readonly pokemonStore = inject(PokemonStore);
  private readonly pokemonSelectors = inject(PokemonSelectors);

  readonly pokemon = toSignal(this.pokemonSelectors.pagedPokemon$, {
    initialValue: [],
  });

  readonly loading = toSignal(this.pokemonSelectors.loading$, {
    initialValue: false,
  });

  readonly error = toSignal(this.pokemonSelectors.error$, {
    initialValue: null,
  });

  readonly selectedPokemon = toSignal(this.pokemonSelectors.selectedPokemon$, {
    initialValue: undefined,
  });

  readonly drawerOpen = signal(false);
  readonly search = signal('');

  readonly totalPokemon = computed(() => this.pokemon().length);

  readonly filteredPokemon = toSignal(this.pokemonSelectors.filteredPokemon$, {
    initialValue: [],
  });

  readonly pokemonTypes = computed(() => {
    const types = new Set<string>();

    for (const pokemon of this.filteredPokemon()) {
      for (const type of pokemon.types) {
        types.add(type.name);
      }
    }

    return [...types].sort();
  });

  constructor() {
    effect(() => {
      this.drawerOpen.set(!!this.selectedPokemon());
    });
  }

  ngOnInit(): void {
    this.pokemonStore.loadPokemon();
  }

  onSearch(value: string): void {
    this.search.set(value);
    this.pokemonStore.search(value);
  }

  onPokemonClick(id: number): void {
    this.pokemonStore.setSelectedPokemon(id);
  }

  closeDrawer(): void {
    this.drawerOpen.set(false);
    this.pokemonStore.setSelectedPokemon(null);
  }

  onSort(event: Sort): void {
    if (!event.active || !event.direction) {
      return;
    }

    this.pokemonStore.setSort(event.active, event.direction);
  }

  onPage(event: PageEvent): void {
    this.pokemonStore.setPagination(event.pageIndex, event.pageSize);
  }

  onTypeChanged(type: string | null): void {
    this.pokemonStore.setType(type);
  }

  trackByPokemon(
    index: number,
    pokemon: { id: number },
  ): number {
    return pokemon.id;
  }

  reloadPokemon(): void {
    this.pokemonStore.loadPokemon();
  }
}
