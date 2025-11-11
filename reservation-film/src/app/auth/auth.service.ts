import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private usersUrl = 'http://localhost:3000/users';
  user: any = null;

  constructor(private http: HttpClient) {
    this.loadUser();
  }

  // Register : crée un nouvel utilisateur
  register(payload: { username: string; password: string; email?: string }): Observable<any> {
    // Vérifier si user existe déjà
    return this.http.get<any[]>(this.usersUrl).pipe(
      map(users => {
        const exists = users.find(u => u.username === payload.username);
        if (exists) throw new Error('Utilisateur déjà existant');
        return users;
      }),
      // POST le nouvel utilisateur
      switchMap(() => this.http.post(this.usersUrl, {
        username: payload.username,
        password: payload.password,
        email: payload.email || '',
        createdAt: new Date().toISOString()
      }))
    );
  }

  // Login : cherche l'user et le sauvegarde
  login(payload: { username: string; password: string }): Observable<any> {
    return this.http.get<any[]>(this.usersUrl).pipe(
      map(users => {
        const user = users.find(u => u.username === payload.username && u.password === payload.password);
        if (!user) throw new Error('Identifiants incorrects');
        this.user = user;
        this.saveUser();
        return user;
      }),
      catchError(err => {
        throw new Error(err.message || 'Erreur de connexion');
      })
    );
  }

  saveUser(): void {
    if (this.user) {
      localStorage.setItem('currentUser', JSON.stringify(this.user));
    }
  }

  loadUser(): void {
    const raw = localStorage.getItem('currentUser');
    if (raw) this.user = JSON.parse(raw);
  }

  logout(): void {
    this.user = null;
    localStorage.removeItem('currentUser');
  }

  isLoggedIn(): boolean {
    return !!this.user;
  }
}
