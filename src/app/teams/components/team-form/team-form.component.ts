import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';

import { Team } from '../../models/team.model';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';
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

import { Pokemon } from '../../../pokedex/models/pokemon.model';
import { PokemonStore } from '../../../pokedex/state/pokemon.store';
import { TeamStore } from '../../state/team.store';
import { uniqueTeamNameValidator } from '../../validators/unique-team-name.validator';

@Component({
  selector: 'app-team-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
  ],
  templateUrl: './team-form.component.html',
  styleUrl: './team-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly teamStore = inject(TeamStore);
  private readonly pokemonStore = inject(PokemonStore);
  private readonly router = inject(Router);
  readonly form = this.fb.nonNullable.group({
    name: this.fb.nonNullable.control(
      '',
      {
        validators: [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
        ],
        asyncValidators: [
          uniqueTeamNameValidator(this.teamStore),
        ],
        updateOn: 'blur',
      },
    ),

    pokemon:
      this.fb.nonNullable.control<Pokemon[]>([]),
  });

  readonly searchControl =
    this.fb.nonNullable.control('');

  readonly selectedPokemon =
    signal<Pokemon[]>([]);

  readonly filteredPokemon$ =
    combineLatest([
      this.pokemonStore.pokemon$,

      this.searchControl.valueChanges.pipe(
        startWith(''),
        debounceTime(300),
        distinctUntilChanged(),
      ),
    ]).pipe(
      map(([pokemon, search]) => {
        const query = search
          .trim()
          .toLowerCase();

        if (!query) {
          return [];
        }

        return pokemon
          .filter((item) =>
            item.name
              .toLowerCase()
              .includes(query),
          )
          .filter(
            (item) =>
              !this
                .selectedPokemon()
                .some(
                  (selected) =>
                    selected.id === item.id,
                ),
          )
          .slice(0, 10);
      }),
    );

  readonly teamSize = computed(() =>
    this.selectedPokemon().length,
  );

  readonly canAddPokemon = computed(
    () => this.teamSize() < 6,
  );

  addPokemon(
    pokemon: Pokemon,
  ): void {
    if (!this.canAddPokemon()) {
      return;
    }

    const updated = [
      ...this.selectedPokemon(),
      pokemon,
    ];

    this.selectedPokemon.set(updated);

    this.form.controls.pokemon.setValue(
      updated,
    );

    this.searchControl.setValue('');
  }

  removePokemon(
    pokemonId: number,
  ): void {
    const updated =
      this.selectedPokemon().filter(
        (pokemon) =>
          pokemon.id !== pokemonId,
      );

    
    this.selectedPokemon.set(updated);

    this.form.controls.pokemon.setValue(
      updated,
    );
  }

 submit(): void {

  if (this.form.invalid) {

    this.form.markAllAsTouched();

    return;
  }

  const team: Omit<Team, 'id'> = {

    trainerId: 1,

    name:
      this.form.controls.name.getRawValue(),

    pokemonIds:
      this.selectedPokemon().map(
        pokemon => pokemon.id,
      ),

    createdAt:
      new Date().toISOString(),
  };

  this.teamStore
    .createTeam(team)
    .subscribe({

      next: () => {

        this.router.navigate([
          '/teams',
        ]);

      },

      error: () => {

        console.error(
          'Unable to create team.',
        );

      },
    });

}

}