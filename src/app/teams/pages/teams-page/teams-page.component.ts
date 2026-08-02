import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';

import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

import { TeamStore } from '../../state/team.store';
import { TeamSelectors } from '../../state/team.selectors';
import { PokemonStore } from '../../../pokedex/state/pokemon.store';
import { TeamListComponent } from '../../components/team-list/team-list.component';

@Component({
  selector: 'app-teams-page',
  standalone: true,
  imports: [TeamListComponent],
  templateUrl: './teams-page.component.html',
  styleUrls: ['./teams-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamsPageComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly teamStore = inject(TeamStore);
  private readonly teamSelectors = inject(TeamSelectors);
  private readonly pokemonStore = inject(PokemonStore);

  readonly teams = toSignal(this.teamSelectors.teams$, {
    initialValue: [],
  });

  readonly loading = toSignal(this.teamSelectors.loading$, {
    initialValue: false,
  });

  readonly error = toSignal(this.teamSelectors.error$, {
    initialValue: null,
  });

  ngOnInit(): void {
    this.pokemonStore.loadPokemon();
    this.teamStore.loadTeams();
  }

  reloadTeams(): void {
    this.teamStore.loadTeams();
  }

  createTeam(): void {
    this.router.navigate(['/teams/create']);
  }

  deleteTeam(id: number): void {
    this.teamStore.deleteTeam(id);
  }
}
