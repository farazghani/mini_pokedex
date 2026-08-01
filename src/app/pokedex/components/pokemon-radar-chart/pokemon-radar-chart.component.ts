import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEchartsDirective } from 'ngx-echarts';
import { EChartsOption } from 'echarts';
import { Pokemon } from '../../models/pokemon.model';

@Component({
  selector: 'app-pokemon-radar-chart',
  standalone: true,
  imports: [
    CommonModule,
    NgxEchartsDirective,
  ],
  templateUrl: './pokemon-radar-chart.component.html',
  styleUrl: './pokemon-radar-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonRadarChartComponent {
  readonly pokemon =
    input<Pokemon | undefined>();
  readonly chartOptions = computed<EChartsOption>(() => {
    const pokemon = this.pokemon();
    if (!pokemon) {
      return {};
    }

    const getStat = (name: string) =>
      pokemon.stats.find(
        stat => stat.name === name,
      )?.baseStat ?? 0;

    return {

      tooltip: {},

      radar: {

        radius: '70%',

        indicator: [
          { name: 'HP', max: 255 },
          { name: 'Attack', max: 255 },
          { name: 'Defense', max: 255 },
          { name: 'Sp. Atk', max: 255 },
          { name: 'Sp. Def', max: 255 },
          { name: 'Speed', max: 255 },
        ],
      },

      series: [

        {
          type: 'radar',
         data: [
            {
               value: [
                getStat('hp'),
                getStat('attack'),
                getStat('defense'),
                getStat('special-attack'),
                getStat('special-defense'),
                getStat('speed'),
              ],
              name: pokemon.name,
            },
          ],
        },
  ],
    };
  });
}