import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./login/login.component').then(m => m.LoginComponent),},
  { path: 'browse', loadComponent: () => import('./browse/browse.component').then(m => m.BrowseComponent)}
    


];
