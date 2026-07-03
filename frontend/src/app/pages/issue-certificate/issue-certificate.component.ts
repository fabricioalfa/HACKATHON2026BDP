import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CertificateService } from '../../services/certificate.service';

@Component({
  selector: 'app-issue-certificate',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, CardModule, ButtonModule, InputTextModule, TextareaModule, SelectModule, MessageModule, ToastModule],
  providers: [MessageService],
  template: `
    <p-toast></p-toast>
    <h2>Emitir Nuevo Certificado</h2>
    <p-card>
      <div class="form-grid">
        <div class="field"><label>Nombre del Titular *</label><input pInputText [(ngModel)]="form.holderName" class="w-full"/></div>
        <div class="field"><label>Documento *</label><input pInputText [(ngModel)]="form.holderDocument" class="w-full"/></div>
        <div class="field"><label>Email</label><input pInputText [(ngModel)]="form.holderEmail" class="w-full"/></div>
        <div class="field"><label>Monto *</label><input pInputText [(ngModel)]="form.amount" type="number" class="w-full"/></div>
        <div class="field"><label>Moneda</label><p-select [options]="currencies" [(ngModel)]="form.currency" class="w-full"></p-select></div>
        <div class="field full"><label>Descripcion</label><textarea pTextarea [(ngModel)]="form.description" rows="3" class="w-full"></textarea></div>
        <div class="field full"><label>Datos del Documento *</label><textarea pTextarea [(ngModel)]="form.documentData" rows="4" class="w-full" placeholder="Contenido del documento para generar hash..."></textarea></div>
      </div>
      <div class="actions">
        <p-button label="Cancelar" class="p-button-secondary" routerLink="/certificates"></p-button>
        <p-button label="Emitir Certificado" icon="pi pi-check" [loading]="loading" (onClick)="onSubmit()"></p-button>
      </div>
    </p-card>
  `,
  styles: [`
    .form-grid{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
    .field{margin-bottom:1rem}.field label{display:block;margin-bottom:0.5rem;font-weight:600;color:#333}
    .full{grid-column:span 2}.w-full{width:100%}
    .actions{display:flex;gap:1rem;justify-content:flex-end;margin-top:1rem;padding-top:1rem;border-top:1px solid #eee}
  `]
})
export class IssueCertificateComponent {
  form: any = { holderName: '', holderDocument: '', holderEmail: '', amount: 0, currency: 'USD', description: '', documentData: '' };
  currencies = [{ label: 'USD', value: 'USD' }, { label: 'EUR', value: 'EUR' }, { label: 'PEN', value: 'PEN' }];
  loading = false;
  constructor(private certService: CertificateService, private messageService: MessageService, private router: Router) {}
  onSubmit() {
    if (!this.form.holderName || !this.form.holderDocument || !this.form.amount || !this.form.documentData) {
      this.messageService.add({ severity: 'warn', summary: 'Campos requeridos', detail: 'Complete todos los campos obligatorios' });
      return;
    }
    this.loading = true;
    this.certService.create(this.form).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'Certificado emitido correctamente' });
        setTimeout(() => this.router.navigate(['/certificates']), 1000);
      },
      error: (err) => { this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'Error al emitir' }); this.loading = false; }
    });
  }
}
