import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';

import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';

import { TeamStore } from '../../state/team.store';
import { PokemonStore } from '../../../pokedex/state/pokemon.store';
import { TeamListComponent } from '../../components/team-list/team-list.component';

@Component({
  selector: 'app-teams-page',
  standalone: true,
  imports: [
    AsyncPipe,
    TeamListComponent,
  ],
  templateUrl: './teams-page.component.html',
  styleUrl: './teams-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamsPageComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly teamStore = inject(TeamStore);
  private readonly pokemonStore = inject(PokemonStore);

  readonly teams$ = this.teamStore.teams$;

  ngOnInit(): void {
    this.pokemonStore.loadPokemon();
    this.teamStore.loadTeams();
  }

  createTeam(): void {
    this.router.navigate(['/teams/create']);
  }

  deleteTeam(id: number): void {
    this.teamStore.deleteTeam(id);
  }
}
