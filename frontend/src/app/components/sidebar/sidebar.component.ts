import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, ButtonModule],
  template: `
    <nav class="sidebar">
      <div class="sidebar-header"><i class="pi pi-shield"></i><span>CreditCerts</span></div>
      <ul class="nav-menu">
        <li><a routerLink="/dashboard" routerLinkActive="active"><i class="pi pi-home"></i> Dashboard</a></li>
        <li><a routerLink="/certificates" routerLinkActive="active"><i class="pi pi-file"></i> Certificados</a></li>
        <li><a routerLink="/certificates/new" *ngIf="isOfficer" routerLinkActive="active"><i class="pi pi-plus-circle"></i> Emitir</a></li>
        <li><a routerLink="/audit" *ngIf="isAdmin" routerLinkActive="active"><i class="pi pi-list"></i> Auditoria</a></li>
        <li><a routerLink="/users" *ngIf="isAdmin" routerLinkActive="active"><i class="pi pi-users"></i> Usuarios</a></li>
      </ul>
      <div class="sidebar-footer">
        <small>{{ user?.fullName }}</small>
        <small class="role-badge">{{ user?.role }}</small>
        <button pButton label="Cerrar Sesión" icon="pi pi-sign-out" class="p-button-outlined p-button-sm logout-btn" (click)="logout()"></button>
      </div>
    </nav>
  `,
  styles: [`
    .sidebar{width:240px;background:#1e3c72;color:white;display:flex;flex-direction:column;position:fixed;height:100vh}
    .sidebar-header{padding:1.25rem;display:flex;align-items:center;gap:0.75rem;font-size:1.2rem;font-weight:700;border-bottom:1px solid rgba(255,255,255,0.1)}
    .sidebar-header i{font-size:1.5rem}
    .nav-menu{list-style:none;padding:1rem 0;margin:0;flex:1}
    .nav-menu li a{display:flex;align-items:center;gap:0.75rem;padding:0.75rem 1.25rem;color:rgba(255,255,255,0.8);text-decoration:none;transition:all 0.2s}
    .nav-menu li a:hover,.nav-menu li a.active{background:rgba(255,255,255,0.1);color:white}
    .sidebar-footer{padding:1rem;border-top:1px solid rgba(255,255,255,0.1);display:flex;flex-direction:column;gap:0.25rem}
    .role-badge{font-size:0.7rem;background:rgba(255,255,255,0.2);padding:2px 8px;border-radius:10px;display:inline-block;width:fit-content}
    .logout-btn{width:100%;margin-top:0.5rem;border-color:rgba(255,255,255,0.3);color:rgba(255,255,255,0.8)}
    .logout-btn:hover{background:rgba(255,255,255,0.1);color:white;border-color:rgba(255,255,255,0.5)}
  `]
})
export class SidebarComponent {
  user: any;
  constructor(private auth: AuthService) {
    this.user = auth.getCurrentUser();
  }
  get isAdmin() { return this.auth.hasRole('admin'); }
  get isOfficer() { return this.auth.hasRole('admin', 'officer'); }
  logout() { this.auth.logout(); }
}
