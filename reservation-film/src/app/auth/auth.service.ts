import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private usersUrl = 'http://localhost:3000/users';
  private currentUserKey = 'currentUser'; // ✅ clé unique pour le stockage
  private currentUser: User | null = null;

  constructor(private http: HttpClient) {}

  // ✅ Enregistrement d’un nouvel utilisateur
  register(userData: Partial<User>): Observable<User> {
    const newUser: User = {
      id: crypto.randomUUID(),
      username: userData.username!,
      email: userData.email!,
      password: userData.password!,
      favorites: [],
      reservations: []
    };

    return this.http.post<User>(this.usersUrl, newUser).pipe(
      tap(user => {
        this.currentUser = user;
        localStorage.setItem(this.currentUserKey, JSON.stringify(user));
      })
    );
  }

  // ✅ Connexion : recherche du user par email + password
  login(email: string, password: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.usersUrl}?email=${email}&password=${password}`);
  }

  // ✅ Sauvegarde du user dans le localStorage
  setCurrentUser(user: User): void {
    this.currentUser = user;
    localStorage.setItem(this.currentUserKey, JSON.stringify(user));
  }

  // ✅ Récupération du user depuis le localStorage
  getCurrentUser(): User | null {
    if (!this.currentUser) {
      const userJson = localStorage.getItem(this.currentUserKey);
      if (userJson) {
        this.currentUser = JSON.parse(userJson);
      }
    }
    return this.currentUser;
  }

  // ✅ Vérifie la connexion
  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }

  // ✅ Déconnexion
  logout(): void {
    this.currentUser = null;
    localStorage.removeItem(this.currentUserKey);
  }
}
