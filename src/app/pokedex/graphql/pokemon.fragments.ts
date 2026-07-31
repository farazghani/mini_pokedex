import { gql } from 'apollo-angular';

export const POKEMON_FIELDS = gql`
  fragment PokemonFields on pokemon_v2_pokemon {
    id
    name
    height
    weight

    pokemon_v2_pokemontypes {
      pokemon_v2_type {
        name
      }
    }

    pokemon_v2_pokemonstats {
      base_stat

      pokemon_v2_stat {
        name
      }
    }

    pokemon_v2_pokemonsprites {
      sprites
    }
  }
`;