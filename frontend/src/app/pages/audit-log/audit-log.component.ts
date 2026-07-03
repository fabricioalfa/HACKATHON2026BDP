import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { AuditService } from '../../services/audit.service';

@Component({
  selector: 'app-audit-log',
  standalone: true,
  imports: [CommonModule, TableModule, CardModule, TagModule, ProgressSpinnerModule, ToastModule],
  template: `
    <p-toast></p-toast>
    <h2>Log de Auditoria</h2>
    <p-card>
      <div *ngIf="loading" class="loading-container">
        <p-progressSpinner strokeWidth="4" [style]="{width:'50px',height:'50px'}"></p-progressSpinner>
      </div>
      <div *ngIf="error" class="error-container">
        <p class="error-text">{{ error }}</p>
      </div>
      <p-table *ngIf="!loading && !error" [value]="logs" [paginator]="true" [rows]="15">
        <ng-template pTemplate="header">
          <tr><th>Accion</th><th>Usuario</th><th>Cert. Blockchain</th><th>Detalles</th><th>Fecha</th></tr>
        </ng-template>
        <ng-template pTemplate="body" let-log>
          <tr>
            <td><p-tag [value]="log.action" [severity]="getSeverity(log.action)"></p-tag></td>
            <td>{{ log.userId }}</td>
            <td>{{ log.blockchainCertificateId || 'N/A' }}</td>
            <td><small>{{ log.details | json }}</small></td>
            <td>{{ log.createdAt | date:'dd/MM/yyyy HH:mm:ss' }}</td>
          </tr>
        </ng-template>
      </p-table>
    </p-card>
  `,
  styles: [`
    .loading-container{display:flex;justify-content:center;padding:3rem}
    .error-container{text-align:center;padding:2rem;color:#ef4444}
    .error-text{font-size:1.1rem}
  `]
})
export class AuditLogComponent implements OnInit {
  logs: any[] = [];
  loading = false;
  error = '';

  constructor(private auditService: AuditService) {}

  ngOnInit() {
    this.loading = true;
    this.auditService.getLogs().subscribe({
      next: (l) => { this.logs = l; this.loading = false; },
      error: (err) => {
        this.error = err.error?.message || 'Error al cargar auditoria';
        this.loading = false;
      }
    });
  }

  getSeverity(action: string) {
    if (action.includes('issued')) return 'success';
    if (action.includes('revoked')) return 'danger';
    return 'info';
  }
}
