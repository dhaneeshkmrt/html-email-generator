import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/email-builder',
    pathMatch: 'full'
  },
  {
    path: 'email-builder',
    loadComponent: () => import('./features/email-builder/email-builder.component').then(m => m.EmailBuilderComponent)
  },
  {
    path: 'preview',
    loadComponent: () => import('./features/preview/preview.component').then(m => m.PreviewComponent)
  },
  {
    path: 'templates',
    loadComponent: () => import('./features/template-library/template-library.component').then(m => m.TemplateLibraryComponent)
  }
];
