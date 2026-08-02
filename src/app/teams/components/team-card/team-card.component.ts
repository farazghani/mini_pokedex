import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';

import { Team } from '../../models/team.model';
import { PokemonStore } from '../../../pokedex/state/pokemon.store';

@Component({
  selector: 'app-team-card',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
  ],
  templateUrl: './team-card.component.html',
  styleUrl: './team-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamCardComponent {
  readonly team = input.required<Team>();
  readonly selected = input(false);
  readonly teamSelected = output<number>();
  readonly delete = output<number>();

  private readonly pokemonStore =
    inject(PokemonStore);

  readonly pokemon = toSignal(
    this.pokemonStore.pokemon$,
    {
      initialValue: [],
    },
  );

  readonly teamPokemon = computed(() =>
    this.pokemon().filter((pokemon) =>
      this.team().pokemonIds.includes(
        pokemon.id,
      ),
    ),
  );

  onSelect(): void {
    this.teamSelected.emit(this.team().id);
  }

  onDelete(): void {
    this.delete.emit(this.team().id);
  }
}
