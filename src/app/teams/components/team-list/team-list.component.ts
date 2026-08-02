import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

import { TeamCardComponent } from '../team-card/team-card.component';
import { Team } from '../../models/team.model';
import { AsyncStateComponent } from '../../../common/components/async-state/async-state.component';

@Component({
  selector: 'app-team-list',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    TeamCardComponent,
    AsyncStateComponent,
  ],
  templateUrl: './team-list.component.html',
  styleUrl: './team-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamListComponent {
  readonly teams = input.required<Team[]>();
  readonly selectedTeamId = input<number | null>(null);
  readonly teamSelected = output<number>();
  readonly teamDeleted = output<number>();
  readonly createClicked = output<void>();
  readonly loading = input(false);
  readonly error = input<string | null>(null);
  readonly emptyMessage = input(
    'Create your first team to get started.',
  );
  readonly retry = output<void>();
}
