import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    {
      path: 'login',
      loadComponent: () => import('./login/login.component').then(m => m.LoginComponent),

    },
  


];
