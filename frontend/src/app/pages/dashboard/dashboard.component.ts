import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CertificateService } from '../../services/certificate.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, TableModule, TagModule, ProgressSpinnerModule],
  template: `
    <h2>Dashboard</h2>
    <div *ngIf="loading" class="loading-container">
      <p-progressSpinner strokeWidth="4" [style]="{width:'50px',height:'50px'}"></p-progressSpinner>
    </div>
    <div *ngIf="error" class="error-container">
      <p class="error-text">{{ error }}</p>
      <p-button label="Reintentar" icon="pi pi-refresh" (onClick)="ngOnInit()"></p-button>
    </div>
    <div *ngIf="!loading && !error">
      <div class="stats-grid">
        <p-card><div class="stat-label">Total</div><div class="stat-value">{{ total }}</div></p-card>
        <p-card><div class="stat-label">Emitidos</div><div class="stat-value text-green">{{ issued }}</div></p-card>
        <p-card><div class="stat-label">Revocados</div><div class="stat-value text-red">{{ revoked }}</div></p-card>
      </div>
      <p-card header="Certificados Recientes" styleClass="mt-4">
        <p-table [value]="recent" [rows]="5" *ngIf="recent.length > 0">
          <ng-template pTemplate="header">
            <tr><th>Holder</th><th>Documento</th><th>Monto</th><th>Estado</th><th>Fecha</th></tr>
          </ng-template>
          <ng-template pTemplate="body" let-cert>
            <tr>
              <td>{{ cert.holderName }}</td>
              <td>{{ cert.holderDocument }}</td>
              <td>{{ cert.currency }} {{ cert.amount | number:'1.2-2' }}</td>
              <td><p-tag [value]="cert.status" [severity]="cert.status === 'issued' ? 'success' : 'danger'"></p-tag></td>
              <td>{{ cert.createdAt | date:'dd/MM/yyyy' }}</td>
            </tr>
          </ng-template>
        </p-table>
        <p *ngIf="recent.length === 0" style="text-align:center;color:#999">No hay certificados aun</p>
      </p-card>
    </div>
  `,
  styles: [`
    .stats-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem}
    .stat-label{color:#666;font-size:0.9rem}
    .stat-value{font-size:2rem;font-weight:700;color:#1e3c72}
    .text-green{color:#22c55e}.text-red{color:#ef4444}.mt-4{margin-top:1.5rem}
    .loading-container{display:flex;justify-content:center;padding:4rem}
    .error-container{text-align:center;padding:3rem;color:#ef4444}
    .error-text{margin-bottom:1rem;font-size:1.1rem}
  `]
})
export class DashboardComponent implements OnInit {
  total = 0;
  issued = 0;
  revoked = 0;
  recent: any[] = [];
  loading = false;
  error = '';

  constructor(private certService: CertificateService) {}

  ngOnInit() {
    this.loading = true;
    this.error = '';
    this.certService.getAll().subscribe({
      next: (certs) => {
        this.total = certs.length;
        this.issued = certs.filter(c => c.status === 'issued').length;
        this.revoked = certs.filter(c => c.status === 'revoked').length;
        this.recent = certs.slice(0, 5);
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Error al cargar certificados';
        this.loading = false;
      }
    });
  }
}
