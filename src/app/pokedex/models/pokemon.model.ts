import { PokemonAbility } from './pokemon-ability.model';
import { PokemonStat } from './pokemon-stat.model';
import { PokemonType } from './pokemon-type.model';

export interface Pokemon {
  id: number;

  name: string;

  height: number;

  weight: number;

  sprite: string;

  stats: PokemonStat[];

  types: PokemonType[];

  abilities?: PokemonAbility[];
}