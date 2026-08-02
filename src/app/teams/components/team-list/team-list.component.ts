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
import { inject } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { TeamDialogComponent } from '../team-dialog/team-dialog.component';


@Component({
  selector: 'app-team-list',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    TeamCardComponent,
  ],
  templateUrl: './team-list.component.html',
  styleUrl: './team-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class TeamListComponent {
  readonly teams =
    input.required<Team[]>();
  readonly selectedTeamId =
    input<number | null>(null);
  readonly teamSelected =
    output<number>();
  readonly teamDeleted =
    output<number>();
  readonly createClicked =
    output<void>();


}