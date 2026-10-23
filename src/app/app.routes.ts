import { Routes } from '@angular/router';
export const routes: Routes = [
  { path: '', redirectTo: 'upload-slip', pathMatch: 'full' },
  { path: 'upload-slip', loadComponent: () => import('./features/upload-slip/upload-slip').then(m => m.UploadSlip) },
];
