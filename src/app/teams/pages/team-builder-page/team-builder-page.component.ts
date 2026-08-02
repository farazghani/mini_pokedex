import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';

import { TeamFormComponent } from '../../components/team-form/team-form.component';

@Component({
  selector: 'app-team-builder-page',
  standalone: true,
  imports: [TeamFormComponent],
  templateUrl: './team-builder-page.component.html',
  styleUrl: './team-builder-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamBuilderPageComponent {}