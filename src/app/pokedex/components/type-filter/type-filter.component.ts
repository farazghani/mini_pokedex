import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-type-filter',
  standalone: true,
  imports: [
    CommonModule,
    MatSelectModule,
  ],
  templateUrl: './type-filter.component.html' ,
  styleUrl: './type-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})


export class TypeFilterComponent {
  readonly types =
    input.required<string[]>();
  readonly selected =
    output<string | null>();
}