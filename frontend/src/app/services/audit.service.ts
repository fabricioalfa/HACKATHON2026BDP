import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuditService {
  constructor(private http: HttpClient) {}
  getLogs(userId?: string, action?: string): Observable<any[]> {
    const params: any = {};
    if (userId) params.userId = userId;
    if (action) params.action = action;
    return this.http.get<any[]>('/api/audit-log', { params });
  }
}
