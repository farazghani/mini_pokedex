import { Routes } from '@angular/router';

export const TEAM_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/teams-page/teams-page.component').then(
        (m) => m.TeamsPageComponent
      ),

  },
  {
    path: 'create',
    loadComponent: () =>
      import('./pages/team-builder-page/team-builder-page.component').then(
        (m) => m.TeamBuilderPageComponent
      ),
  },
];