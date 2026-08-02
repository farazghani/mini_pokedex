import { Routes } from '@angular/router';

export const routes: Routes = [
    {
    path: '',
    loadComponent: () =>
      import('./pokedex/pages/pokedex-page.component').then(
        (m) => m.PokedexPageComponent,
      ),
  },
   {
  path: 'teams',
  loadChildren: () =>
    import('./teams/teams.routes').then(m => m.TEAM_ROUTES),
    }
];

