import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CertificateService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> { return this.http.get<any[]>('/api/certificates'); }
  getOne(id: string): Observable<any> { return this.http.get(`/api/certificates/${id}`); }
  create(data: any): Observable<any> { return this.http.post('/api/certificates', data); }
  revoke(id: string): Observable<any> { return this.http.put(`/api/certificates/${id}/revoke`, {}); }
  validate(id: string): Observable<any> { return this.http.post(`/api/certificates/${id}/validate`, {}); }
}
