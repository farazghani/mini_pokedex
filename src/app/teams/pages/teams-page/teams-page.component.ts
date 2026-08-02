import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';

import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { TeamStore } from '../../state/team.store';
import { TeamCardComponent } from '../../components/team-card/team-card.component';

@Component({
  selector: 'app-teams-page',
  standalone: true,
  imports: [
    AsyncPipe,
    RouterLink,
    TeamCardComponent,
  ],
  templateUrl: './teams-page.component.html',
  styleUrl: './teams-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamsPageComponent implements OnInit {

  private readonly teamStore =
    inject(TeamStore);

  readonly teams$ =
    this.teamStore.teams$;

  ngOnInit(): void {

    this.teamStore.loadTeams();

  }

  deleteTeam(
    id: number,
  ): void {

    this.teamStore.deleteTeam(id);

  }

}