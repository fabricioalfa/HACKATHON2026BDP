import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: string;
  walletAddress?: string;
  isActive: boolean;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<User[]> {
    return this.http.get<User[]>('/api/users');
  }

  getOne(id: string): Observable<User> {
    return this.http.get<User>(`/api/users/${id}`);
  }

  create(data: { username: string; email: string; password: string; fullName: string; role: string; walletAddress?: string }): Observable<User> {
    return this.http.post<User>('/api/users', data);
  }

  update(id: string, data: { email?: string; fullName?: string; role?: string; walletAddress?: string }): Observable<User> {
    return this.http.put<User>(`/api/users/${id}`, data);
  }

  deactivate(id: string): Observable<any> {
    return this.http.delete(`/api/users/${id}`);
  }
}
