import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    const user = localStorage.getItem('currentUser');
    if (user) this.currentUserSubject.next(JSON.parse(user));
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post('/api/auth/login', { username, password }).pipe(
      tap((res: any) => {
        localStorage.setItem('token', res.accessToken);
        localStorage.setItem('currentUser', JSON.stringify(res.user));
        this.currentUserSubject.next(res.user);
      }),
      catchError(err => { this.logout(); return throwError(() => err); })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    try {
      const decoded: any = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) { this.logout(); return false; }
      return true;
    } catch { this.logout(); return false; }
  }

  getToken(): string | null { return localStorage.getItem('token'); }
  getCurrentUser(): any { return this.currentUserSubject.value; }
  getUserRole(): string { return this.currentUserSubject.value?.role || ''; }
  hasRole(...roles: string[]): boolean { return roles.includes(this.getUserRole()); }
}
