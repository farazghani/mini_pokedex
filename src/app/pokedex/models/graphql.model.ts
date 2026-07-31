export interface PokemonQueryResponse {
  pokemon_v2_pokemon?: PokemonGraphQL[];
}

export interface PokemonGraphQL {
  id: number;

  name: string;

  height: number;

  weight: number;

  pokemon_v2_pokemontypes: PokemonTypeGraphQL[];

  pokemon_v2_pokemonstats: PokemonStatGraphQL[];

  pokemon_v2_pokemonsprites: PokemonSpriteGraphQL[];
}

export interface PokemonTypeGraphQL {
  pokemon_v2_type: {
    name: string;
  };
}

export interface PokemonStatGraphQL {
  base_stat: number;

  pokemon_v2_stat: {
    name: string;
  };
}

export interface PokemonSpriteGraphQL {
  sprites: string;
}