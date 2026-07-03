import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LayoutComponent } from './components/layout/layout.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'certificates', loadComponent: () => import('./pages/certificates/certificates.component').then(m => m.CertificatesComponent) },
      { path: 'certificates/new', loadComponent: () => import('./pages/issue-certificate/issue-certificate.component').then(m => m.IssueCertificateComponent) },
      { path: 'certificates/:id', loadComponent: () => import('./pages/certificate-detail/certificate-detail.component').then(m => m.CertificateDetailComponent) },
      { path: 'audit', loadComponent: () => import('./pages/audit-log/audit-log.component').then(m => m.AuditLogComponent) },
      { path: 'users', loadComponent: () => import('./pages/user-management/user-management.component').then(m => m.UserManagementComponent) },
    ]
  },
  { path: '**', redirectTo: '/dashboard' },
];
