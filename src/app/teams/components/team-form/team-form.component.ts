import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';

import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import {
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
} from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

import { Pokemon } from '../../../pokedex/models/pokemon.model';
import { PokemonStore } from '../../../pokedex/state/pokemon.store';

import { Team } from '../../models/team.model';
import { TeamStore } from '../../state/team.store';
import { uniqueTeamNameValidator } from '../../validators/unique-team-name.validator';
import { AsyncStateComponent } from '../../../common/components/async-state/async-state.component';

@Component({
  selector: 'app-team-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatIconModule,
    AsyncStateComponent,
  ],
  templateUrl: './team-form.component.html',
  styleUrl: './team-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly teamStore = inject(TeamStore);
  private readonly pokemonStore = inject(PokemonStore);
  private readonly router = inject(Router);

  readonly form = this.fb.nonNullable.group({
    name: this.fb.nonNullable.control('', {
      validators: [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30),
      ],
      asyncValidators: [
        uniqueTeamNameValidator(this.teamStore),
      ],
      updateOn: 'blur',
    }),
    pokemon: this.fb.nonNullable.control<Pokemon[]>([]),
  });

  readonly searchControl =
    this.fb.nonNullable.control<string | Pokemon>('');

  readonly searchValue = toSignal(
    this.searchControl.valueChanges.pipe(
      startWith(''),
    ),
    {
      initialValue: '',
    },
  );

  readonly selectedPokemon =
    signal<Pokemon[]>([]);

  readonly pokemonLoading = toSignal(
    this.pokemonStore.loading$,
    {
      initialValue: false,
    },
  );

  readonly pokemonError = toSignal(
    this.pokemonStore.error$,
    {
      initialValue: null,
    },
  );

  readonly filteredPokemon$ = combineLatest([
    this.pokemonStore.pokemon$,
    this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
    ),
  ]).pipe(
    map(([pokemon, search]) => {
      const query = this.toSearchTerm(search);

      if (!query) {
        return [];
      }

      return pokemon
        .filter((item) =>
          item.name.toLowerCase().includes(query),
        )
        .filter(
          (item) =>
            !this.selectedPokemon().some(
              (selected) => selected.id === item.id,
            ),
        )
        .slice(0, 10);
    }),
  );

  readonly filteredPokemon = toSignal(
    this.filteredPokemon$,
    {
      initialValue: [],
    },
  );

  readonly autocompleteEmpty = computed(
    () => this.filteredPokemon().length === 0,
  );

  readonly autocompleteEmptyTitle = computed(() =>
    this.searchTerm()
      ? 'No Pokémon Found'
      : 'Start typing to search',
  );

  readonly autocompleteEmptyMessage = computed(() =>
    this.searchTerm()
      ? 'No Pokémon match your search.'
      : 'Type at least one character to search the Pokémon cache.',
  );

  readonly teamSize = computed(
    () => this.selectedPokemon().length,
  );

  readonly canAddPokemon = computed(
    () => this.teamSize() < 6,
  );

  readonly searchTerm = computed(() =>
    this.toSearchTerm(this.searchValue()),
  );

  ngOnInit(): void {
    this.pokemonStore.loadPokemon();
  }

  displayPokemon(
    value: string | Pokemon | null,
  ): string {
    return typeof value === 'string'
      ? value
      : value?.name ?? '';
  }

  retryPokemonLoad(): void {
    this.pokemonStore.loadPokemon();
  }

  addPokemon(pokemon: Pokemon): void {
    if (!this.canAddPokemon()) {
      return;
    }

    if (
      this.selectedPokemon().some(
        (selected) => selected.id === pokemon.id,
      )
    ) {
      return;
    }

    const updated = [
      ...this.selectedPokemon(),
      pokemon,
    ];

    this.selectedPokemon.set(updated);

    this.form.controls.pokemon.setValue(updated);

    this.searchControl.setValue('');
  }

  removePokemon(pokemonId: number): void {
    const updated = this.selectedPokemon().filter(
      (pokemon) => pokemon.id !== pokemonId,
    );

    this.selectedPokemon.set(updated);

    this.form.controls.pokemon.setValue(updated);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const team: Omit<Team, 'id'> = {
      trainerId: 1,
      name: this.form.controls.name.getRawValue(),
      pokemonIds: this.selectedPokemon().map(
        (pokemon) => pokemon.id,
      ),
      createdAt: new Date().toISOString(),
    };

    this.teamStore.createTeam(team).subscribe({
      next: () => {
        this.router.navigate(['/teams']);
      },
      error: () => {
        console.error('Unable to create team.');
      },
    });
  }

  private toSearchTerm(
    value: string | Pokemon | null,
  ): string {
    if (typeof value === 'string') {
      return value.trim().toLowerCase();
    }

    return value?.name?.trim().toLowerCase() ?? '';
  }
}
