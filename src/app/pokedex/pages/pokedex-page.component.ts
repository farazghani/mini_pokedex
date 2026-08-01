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
import { PokemonStore } from '../state/pokemon.store';
import { PokemonSelectors } from '../state/pokemon.selectors';
import { TeamStore } from '../../teams/state/team.store';
import { TeamSelectors } from '../../teams/state/team.selectors';
import { Sort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { PokemonTableComponent } from '../components/pokemon-table/pokemon-table';
import { SearchBarComponent } from '../components/search-bar/search-bar.component';
import { TypeFilterComponent } from '../components/type-filter/type-filter.component';
import { MatSidenavModule } from '@angular/material/sidenav';
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
  private readonly teamStore = inject(TeamStore);
  private readonly teamSelectors = inject(TeamSelectors);

  // ------------------------------------------------------
  // Observable → Signal
  // ------------------------------------------------------

  readonly pokemon = toSignal(
    this.pokemonSelectors.pagedPokemon$,
    {
      initialValue: [],
    },
  );

  readonly loading = toSignal(
    this.pokemonSelectors.loading$,
    {
      initialValue: false,
    },
  );

  readonly error = toSignal(
    this.pokemonSelectors.error$,
    {
      initialValue: null,
    },
  );

  readonly selectedPokemon = toSignal(
    this.pokemonSelectors.selectedPokemon$,
    {
      initialValue: undefined,
    },
  );

  readonly teams = toSignal(
    this.teamSelectors.teams$,
    {
      initialValue: [],
    },
  );

  readonly selectedTeam = toSignal(
    this.teamSelectors.selectedTeam$,
    {
      initialValue: undefined,
    },
  );

 
  readonly drawerOpen = signal(false);
  readonly search = signal('');

  

  readonly totalPokemon = computed(
    () => this.pokemon().length,
  );

  readonly teamCount = computed(
    () => this.teams().length,
  );

readonly filteredPokemon = toSignal(
  this.pokemonSelectors.filteredPokemon$,
  {
    initialValue: [],
  },
);


readonly pokemonTypes = computed(() => {
  const types = new Set<string>();
  for (const pokemon of this.filteredPokemon()) {
    for (const type of pokemon.types) {
      types.add(type.name);
    }
  }
  return [...types].sort();
});

  // ------------------------------------------------------
  // Constructor
  // ------------------------------------------------------

  constructor() {
    // Open / Close Detail Drawer
    effect(() => {
      this.drawerOpen.set(
        !!this.selectedPokemon(),
      );
    });

    // Persist selected team
    effect(() => {
      const team = this.selectedTeam();

      if (!team) {
        return;
      }

      localStorage.setItem(
        'selected-team',
        JSON.stringify(team),
      );
    });
  }

  // ------------------------------------------------------
  // Lifecycle
  // ------------------------------------------------------

  ngOnInit(): void {
    this.pokemonStore.loadPokemon();
    this.teamStore.loadTeams();
  }

  // ------------------------------------------------------
  // UI Events
  // ------------------------------------------------------

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

  this.pokemonStore.setSort(
    event.active,
    event.direction,
  );
}

onPage(event: PageEvent): void {

  this.pokemonStore.setPagination(
    event.pageIndex,
    event.pageSize,
  );
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
}