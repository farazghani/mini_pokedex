import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { Pokemon } from '../../models/pokemon.model';

@Component({
  selector: 'app-pokemon-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatDividerModule,
    MatChipsModule,
    MatIconModule,
  ],

  templateUrl: './pokemon-detail.component.html',
  styleUrl: './pokemon-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonDetailComponent {

  readonly pokemon =
    input<Pokemon | undefined>();

  readonly totalStats =
    computed(() => {

      const pokemon = this.pokemon();

      if (!pokemon) {
        return 0;
      }

      return pokemon.stats.reduce(
        (sum, stat) => sum + stat.baseStat,
        0,
      );

    });

    readonly closed = output<void>();
    close(): void {
    this.closed.emit();
    }

  getStat(name: string): number {

    return (
      this.pokemon()
        ?.stats.find(
          stat => stat.name === name,
        )
        ?.baseStat ?? 0
    );

  }

}