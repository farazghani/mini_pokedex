import {
  AsyncValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';

import {
  debounceTime,
  first,
  map,
} from 'rxjs/operators';

import { TeamStore } from '../state/team.store';

export function uniqueTeamNameValidator(
  teamStore: TeamStore,
): AsyncValidatorFn {

  return (
    control: AbstractControl,
  ) => {

    return teamStore.teams$.pipe(

      debounceTime(300),

      map((teams) => {

        const exists =
          teams.some(

            (team) =>

              team.name
                .toLowerCase()
                .trim() ===
              control.value
                ?.toLowerCase()
                .trim(),

          );

        return exists

          ? {
              teamExists: true,
            }

          : null;

      }),

      first(),

    );

  };

}