import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-async-state',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './async-state.component.html',
  styleUrl: './async-state.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsyncStateComponent {
  readonly loading = input(false);
  readonly error = input<string | null>(null);
  readonly empty = input(false);

  readonly loadingTitle = input('Loading');
  readonly loadingMessage = input('Please wait.');

  readonly emptyTitle = input('No results');
  readonly emptyMessage = input('Nothing to show.');

  readonly errorTitle = input('Something went wrong');
  readonly errorMessage = input(
    'Please try again.',
  );
  readonly retryLabel = input('Retry');

  readonly retry = output<void>();
}
