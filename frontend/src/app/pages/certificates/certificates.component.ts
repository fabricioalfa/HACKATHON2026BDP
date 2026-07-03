import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../services/auth.service';
import { CertificateService } from '../../services/certificate.service';

@Component({
  selector: 'app-certificates',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TableModule, CardModule, ButtonModule, InputTextModule, TagModule, DropdownModule, ProgressSpinnerModule, ToastModule],
  template: `
    <p-toast></p-toast>
    <div class="page-header">
      <h2>Certificados</h2>
      <p-button *ngIf="isOfficer" label="Emitir Certificado" icon="pi pi-plus" routerLink="/certificates/new"></p-button>
    </div>
    <p-card>
      <div class="filters">
        <span class="p-input-icon-left"><i class="pi pi-search"></i><input pInputText [(ngModel)]="search" placeholder="Buscar..." (ngModelChange)="filter()"/></span>
        <p-dropdown [options]="statusOptions" [(ngModel)]="statusFilter" optionLabel="label" optionValue="value" placeholder="Estado" (onChange)="filter()"></p-dropdown>
      </div>
      <div *ngIf="loading" class="loading-container">
        <p-progressSpinner strokeWidth="4" [style]="{width:'50px',height:'50px'}"></p-progressSpinner>
      </div>
      <p-table *ngIf="!loading" [value]="filtered" [paginator]="true" [rows]="10" [rowsPerPageOptions]="[5,10,20]">
        <ng-template pTemplate="header">
          <tr>
            <th>Holder</th><th>Documento</th><th>Monto</th><th>Moneda</th><th>Estado</th><th>Fecha</th><th>Acciones</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-cert>
          <tr>
            <td>{{ cert.holderName }}</td>
            <td>{{ cert.holderDocument }}</td>
            <td>{{ cert.amount | number:'1.2-2' }}</td>
            <td>{{ cert.currency }}</td>
            <td><p-tag [value]="cert.status" [severity]="cert.status === 'issued' ? 'success' : 'danger'"></p-tag></td>
            <td>{{ cert.createdAt | date:'dd/MM/yyyy HH:mm' }}</td>
            <td>
              <p-button icon="pi pi-eye" class="p-button-text p-button-sm" [routerLink]="['/certificates', cert.id]"></p-button>
              <p-button *ngIf="cert.status==='issued' && isOfficer" icon="pi pi-ban" class="p-button-text p-button-danger p-button-sm" (onClick)="revoke(cert)"></p-button>
            </td>
          </tr>
        </ng-template>
      </p-table>
    </p-card>
  `,
  styles: [`
    .page-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem}
    .filters{display:flex;gap:1rem;margin-bottom:1rem}
    .loading-container{display:flex;justify-content:center;padding:3rem}
  `]
})
export class CertificatesComponent implements OnInit {
  certs: any[] = [];
  filtered: any[] = [];
  search = '';
  statusFilter = '';
  loading = false;
  statusOptions = [{ label: 'Todos', value: '' }, { label: 'Emitido', value: 'issued' }, { label: 'Revocado', value: 'revoked' }];

  constructor(
    private certService: CertificateService,
    private auth: AuthService,
    private messageService: MessageService
  ) {}

  get isOfficer() { return this.auth.hasRole('admin', 'officer'); }

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.certService.getAll().subscribe({
      next: (c) => { this.certs = c; this.filter(); this.loading = false; },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'Error al cargar certificados' });
        this.loading = false;
      }
    });
  }

  filter() {
    this.filtered = this.certs.filter(c => {
      const matchSearch = !this.search || c.holderName.toLowerCase().includes(this.search.toLowerCase()) || c.holderDocument.includes(this.search);
      const matchStatus = !this.statusFilter || c.status === this.statusFilter;
      return matchSearch && matchStatus;
    });
  }

  revoke(cert: any) {
    if (confirm('Revocar este certificado?')) {
      this.certService.revoke(cert.id).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Certificado revocado' });
          this.load();
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'Error al revocar certificado' });
        }
      });
    }
  }
}
