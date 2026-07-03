import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ProgressBar } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth.service';
import { CertificateService } from '../../services/certificate.service';

@Component({
  selector: 'app-certificate-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, CardModule, ButtonModule, TagModule, ProgressBar, ToastModule],
  template: `
    <p-toast></p-toast>
    <p-button label="Volver" icon="pi pi-arrow-left" class="p-button-text mb-3" routerLink="/certificates"></p-button>
    <h2>Detalle del Certificado</h2>
    <div *ngIf="loading" style="text-align:center;padding:3rem"><p-progressBar mode="indeterminate"></p-progressBar></div>
    <div *ngIf="error" class="error-container">
      <p class="error-text">{{ error }}</p>
      <p-button label="Reintentar" icon="pi pi-refresh" (onClick)="ngOnInit()"></p-button>
    </div>
    <div *ngIf="!loading && !error && cert">
      <div class="info-grid">
        <p-card header="Informacion del Titular">
          <div class="info-row"><span class="label">Nombre:</span><span>{{ cert.holderName }}</span></div>
          <div class="info-row"><span class="label">Documento:</span><span>{{ cert.holderDocument }}</span></div>
          <div class="info-row"><span class="label">Email:</span><span>{{ cert.holderEmail || 'N/A' }}</span></div>
        </p-card>
        <p-card header="Informacion Financiera">
          <div class="info-row"><span class="label">Monto:</span><span>{{ cert.currency }} {{ cert.amount | number:'1.2-2' }}</span></div>
          <div class="info-row"><span class="label">Moneda:</span><span>{{ cert.currency }}</span></div>
          <div class="info-row"><span class="label">Descripcion:</span><span>{{ cert.description || 'N/A' }}</span></div>
        </p-card>
        <p-card header="Estado">
          <div class="info-row"><span class="label">Estado:</span><p-tag [value]="cert.status" [severity]="cert.status === 'issued' ? 'success' : 'danger'"></p-tag></div>
          <div class="info-row"><span class="label">Creado:</span><span>{{ cert.createdAt | date:'dd/MM/yyyy HH:mm' }}</span></div>
          <div class="info-row"><span class="label">ID Blockchain:</span><span>{{ cert.blockchainCertificateId }}</span></div>
        </p-card>
      </div>
      <p-card header="Metadata" styleClass="mt-3">
        <pre class="json-block">{{ cert.metadata | json }}</pre>
      </p-card>
      <div class="actions" *ngIf="cert.status === 'issued' && isOfficer">
        <p-button label="Revocar Certificado" icon="pi pi-ban" severity="danger" [loading]="revoking" (onClick)="revoke()"></p-button>
      </div>
    </div>
  `,
  styles: [`
    .info-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:1.5rem}
    .info-row{display:flex;justify-content:space-between;padding:0.5rem 0;border-bottom:1px solid #f0f0f0}
    .label{font-weight:600;color:#555}
    .mt-3{margin-top:1.5rem}.mb-3{margin-bottom:1rem}
    .json-block{background:#f8f9fa;padding:1rem;border-radius:6px;font-size:0.85rem;overflow-x:auto}
    .actions{margin-top:1.5rem;text-align:right}
    .error-container{text-align:center;padding:3rem;color:#ef4444}
    .error-text{margin-bottom:1rem;font-size:1.1rem}
  `]
})
export class CertificateDetailComponent implements OnInit {
  cert: any = null;
  loading = true;
  error = '';
  revoking = false;

  constructor(
    private route: ActivatedRoute,
    private certService: CertificateService,
    private auth: AuthService,
    private messageService: MessageService
  ) {}

  get isOfficer() { return this.auth.hasRole('admin', 'officer'); }

  ngOnInit() {
    this.loading = true;
    this.error = '';
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.certService.getOne(id).subscribe({
        next: (c) => { this.cert = c; this.loading = false; },
        error: (err) => {
          this.error = err.error?.message || 'Error al cargar certificado';
          this.loading = false;
        }
      });
    }
  }

  revoke() {
    if (confirm('Revocar este certificado?')) {
      this.revoking = true;
      this.certService.revoke(this.cert.id).subscribe({
        next: () => {
          this.cert.status = 'revoked';
          this.revoking = false;
          this.messageService.add({ severity: 'success', summary: 'Certificado revocado' });
        },
        error: (err) => {
          this.revoking = false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'Error al revocar' });
        }
      });
    }
  }
}
