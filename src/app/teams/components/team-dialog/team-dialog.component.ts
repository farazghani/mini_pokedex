import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import {
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

import { MatFormFieldModule } from '@angular/material/form-field';

import { MatInputModule } from '@angular/material/input';

import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-team-dialog',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],

  templateUrl: './team-dialog.component.html',

  styleUrl: './team-dialog.component.scss',

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamDialogComponent {

  private readonly fb =
    inject(FormBuilder);

  private readonly dialogRef =
    inject(MatDialogRef<TeamDialogComponent>);

  readonly form =
    this.fb.nonNullable.group({

      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
        ],
      ],

    });

  create(): void {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.dialogRef.close({
      name: this.form.getRawValue().name,
    });
  }
  cancel(): void {
    this.dialogRef.close();
  }

}