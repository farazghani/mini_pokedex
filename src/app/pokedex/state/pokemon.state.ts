import { Pokemon } from '../models/pokemon.model';

export interface PokemonState {
  pokemon: Pokemon[];


  loading: boolean;

  error: string | null;

  search: string;

  selectedType: string | null;

  selectedPokemonId: number | null;

  pageIndex: number;

  pageSize: number;

  sortField: string;

  sortDirection: 'asc' | 'desc';
}

export const initialPokemonState: PokemonState = {
  pokemon: [],

  loading: false,

  error: null,

  search: '',

  selectedType: null,

  selectedPokemonId: null,

  pageIndex: 0,

  pageSize: 10,

  sortField: 'id',

  sortDirection: 'asc',

};