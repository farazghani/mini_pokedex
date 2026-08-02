import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

import { Pokemon } from '../../models/pokemon.model';
import { PokemonRadarChartComponent } from '../pokemon-radar-chart/pokemon-radar-chart.component';
import { AsyncStateComponent } from '../../../common/components/async-state/async-state.component';

@Component({
  selector: 'app-pokemon-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatChipsModule,
    MatIconModule,
    PokemonRadarChartComponent,
    AsyncStateComponent,
  ],
  templateUrl: './pokemon-detail.component.html',
  styleUrl: './pokemon-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonDetailComponent {
  readonly pokemon = input<Pokemon | undefined>();
  readonly loading = input(false);
  readonly error = input<string | null>(null);

  readonly closed = output<void>();
  readonly retry = output<void>();

  readonly empty = computed(() => !this.pokemon());

  readonly totalStats = computed(() => {
    const pokemon = this.pokemon();

    if (!pokemon) {
      return 0;
    }

    return pokemon.stats.reduce(
      (sum, stat) => sum + stat.baseStat,
      0,
    );
  });

  close(): void {
    this.closed.emit();
  }

  getStat(name: string): number {
    return (
      this.pokemon()
        ?.stats.find((stat) => stat.name === name)
        ?.baseStat ?? 0
    );
  }
}
