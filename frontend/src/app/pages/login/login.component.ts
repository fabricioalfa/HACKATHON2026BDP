import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { PasswordModule } from 'primeng/password';
import { MessageModule } from 'primeng/message';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, CardModule, PasswordModule, MessageModule],
  template: `
    <div class="login-wrapper">
      <p-card styleClass="login-card">
        <ng-template pTemplate="header">
          <div class="login-header">
            <i class="pi pi-shield login-icon"></i>
            <h1>Credit Certificate System</h1>
            <p>Inicie sesion para continuar</p>
          </div>
        </ng-template>
        <div class="login-form">
          <div class="field">
            <label for="username">Usuario</label>
            <input pInputText id="username" [(ngModel)]="username" placeholder="admin" class="w-full" />
          </div>
          <div class="field">
            <label for="password">Contrasena</label>
            <p-password id="password" [(ngModel)]="password" placeholder="admin123" [feedback]="false" [toggleMask]="true" styleClass="w-full" inputStyleClass="w-full" />
          </div>
          <p-message *ngIf="error" severity="error" [text]="error" styleClass="w-full mb-3"></p-message>
          <p-button label="Iniciar Sesion" icon="pi pi-sign-in" [loading]="loading" (onClick)="onLogin()" styleClass="w-full" />
          <div class="login-hint"><small>Demo: admin / admin123</small></div>
        </div>
      </p-card>
    </div>
  `,
  styles: [`
    .login-wrapper{display:flex;justify-content:center;align-items:center;min-height:100vh;background:linear-gradient(135deg,#1e3c72 0%,#2a5298 100%)}
    :host ::ng-deep .login-card{width:420px;border-radius:12px}
    .login-header{text-align:center;padding:1.5rem}
    .login-header h1{margin:0.5rem 0 0.25rem;font-size:1.4rem;color:#1e3c72}
    .login-header p{margin:0;color:#666}
    .login-icon{font-size:3rem;color:#1e3c72}
    .login-form{padding:1rem}
    .field{margin-bottom:1.25rem}
    .field label{display:block;margin-bottom:0.5rem;font-weight:600;color:#333}
    .w-full{width:100%}.mb-3{margin-bottom:1rem}
    .login-hint{text-align:center;margin-top:1rem;color:#999}
  `]
})
export class LoginComponent {
  username = '';
  password = '';
  loading = false;
  error = '';
  constructor(private auth: AuthService, private router: Router) {
    if (auth.isAuthenticated()) router.navigate(['/dashboard']);
  }
  onLogin() {
    this.loading = true;
    this.error = '';
    this.auth.login(this.username, this.password).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => { this.error = err.error?.message || 'Credenciales invalidas'; this.loading = false; }
    });
  }
}
