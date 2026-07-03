import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { UserService, User } from '../../services/user.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, CardModule, TagModule, ButtonModule, DialogModule, InputTextModule, PasswordModule, DropdownModule, ProgressSpinnerModule, ToastModule],
  template: `
    <p-toast></p-toast>
    <div class="page-header">
      <h2>Gestion de Usuarios</h2>
      <p-button label="Crear Usuario" icon="pi pi-plus" (onClick)="showCreateDialog()"></p-button>
    </div>
    <p-card>
      <div *ngIf="loading" class="loading-container">
        <p-progressSpinner strokeWidth="4" [style]="{width:'50px',height:'50px'}"></p-progressSpinner>
      </div>
      <div *ngIf="error" class="error-container">
        <p class="error-text">{{ error }}</p>
      </div>
      <p-table *ngIf="!loading && !error" [value]="users" [paginator]="true" [rows]="10">
        <ng-template pTemplate="header">
          <tr><th>Usuario</th><th>Nombre</th><th>Email</th><th>Rol</th><th>Activo</th><th>Acciones</th></tr>
        </ng-template>
        <ng-template pTemplate="body" let-u>
          <tr>
            <td>{{ u.username }}</td>
            <td>{{ u.fullName }}</td>
            <td>{{ u.email }}</td>
            <td><p-tag [value]="u.role"></p-tag></td>
            <td><i class="pi" [ngClass]="u.isActive ? 'pi-check-circle text-green' : 'pi-times-circle text-red'"></i></td>
            <td>
              <p-button *ngIf="u.isActive && u.username !== 'admin'" icon="pi pi-times" class="p-button-text p-button-danger p-button-sm" pTooltip="Desactivar" (onClick)="deactivate(u)"></p-button>
            </td>
          </tr>
        </ng-template>
      </p-table>
    </p-card>

    <p-dialog header="Crear Usuario" [(visible)]="dialogVisible" [modal]="true" [style]="{width:'450px'}">
      <div class="form-grid">
        <div class="field">
          <label for="username">Username</label>
          <input id="username" pInputText [(ngModel)]="newUser.username" class="w-full"/>
        </div>
        <div class="field">
          <label for="fullName">Nombre completo</label>
          <input id="fullName" pInputText [(ngModel)]="newUser.fullName" class="w-full"/>
        </div>
        <div class="field">
          <label for="email">Email</label>
          <input id="email" pInputText [(ngModel)]="newUser.email" class="w-full"/>
        </div>
        <div class="field">
          <label for="password">Password</label>
          <p-password id="password" [(ngModel)]="newUser.password" [feedback]="false" [style]="{width:'100%'}"></p-password>
        </div>
        <div class="field">
          <label for="role">Rol</label>
          <p-dropdown id="role" [options]="roleOptions" [(ngModel)]="newUser.role" optionLabel="label" optionValue="value" placeholder="Seleccionar rol" [style]="{width:'100%'}"></p-dropdown>
        </div>
      </div>
      <ng-template pTemplate="footer">
        <p-button label="Cancelar" class="p-button-text" (onClick)="dialogVisible=false"></p-button>
        <p-button label="Crear" (onClick)="createUser()" [loading]="creating"></p-button>
      </ng-template>
    </p-dialog>
  `,
  styles: [`
    .page-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem}
    .text-green{color:#22c55e}.text-red{color:#ef4444}
    .loading-container{display:flex;justify-content:center;padding:3rem}
    .error-container{text-align:center;padding:2rem;color:#ef4444}
    .error-text{font-size:1.1rem}
    .form-grid{display:flex;flex-direction:column;gap:1rem}
    .field label{display:block;margin-bottom:0.5rem;font-weight:600}
    .w-full{width:100%}
  `]
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  loading = false;
  error = '';
  dialogVisible = false;
  creating = false;

  newUser = { username: '', email: '', password: '', fullName: '', role: 'viewer' };
  roleOptions = [
    { label: 'Administrador', value: 'admin' },
    { label: 'Oficial', value: 'officer' },
    { label: 'Visor', value: 'viewer' }
  ];

  constructor(private userService: UserService, private messageService: MessageService) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.userService.getAll().subscribe({
      next: (u) => { this.users = u; this.loading = false; },
      error: (err) => {
        this.error = err.error?.message || 'Error al cargar usuarios';
        this.loading = false;
      }
    });
  }

  showCreateDialog() {
    this.newUser = { username: '', email: '', password: '', fullName: '', role: 'viewer' };
    this.dialogVisible = true;
  }

  createUser() {
    this.creating = true;
    this.userService.create(this.newUser).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Usuario creado' });
        this.dialogVisible = false;
        this.creating = false;
        this.load();
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'Error al crear usuario' });
        this.creating = false;
      }
    });
  }

  deactivate(user: User) {
    if (confirm(`Desactivar usuario ${user.username}?`)) {
      this.userService.deactivate(user.id).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Usuario desactivado' });
          this.load();
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'Error al desactivar usuario' });
        }
      });
    }
  }
}
