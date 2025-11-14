import { Injectable } from '@angular/core';
import { Favorite } from '../../../models/favorite.model';
import { User } from '../../../models/user.model';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../auth/auth.service';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavaritesService {

  loading = false;
  favorites: Favorite[] = [];
  user: User | null = null;
  private url = 'http://localhost:3000/favorites';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  loadFavorites(): Observable<Favorite[]> {
    const userId = this.authService.getCurrentUser()?.id;
    return this.http.get<Favorite[]>(`${this.url}?userId=${userId}`).pipe(
      tap((data) => (this.favorites = data))
    );
  }

  removeFavorite(favoriteId: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${favoriteId}`);
  }
}
