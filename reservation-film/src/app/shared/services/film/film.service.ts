import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import { Observable, switchMap, tap, throwError } from 'rxjs';
import { Film } from '../../../models/film.model';
import { Favorite } from '../../../models/favorite.model';

@Injectable({
  providedIn: 'root'
})
export class FilmService {

 
  favorites = new Set<string>();

  filmList: any[] = [];
  loading = false;
  error: string | null = null;
  private moviesUrl = 'http://localhost:3000/movies';
  private favoritesUrl = 'http://localhost:3000/favorites';

  loadingFilm = false;
  submitting = false;
  success: string | null = null;

  selectedFilmId: number | null = null;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

   loadFilms(): Observable<Film[]> {
    this.loading = true;
    this.error = null;
    return this.http.get<Film[]>(this.moviesUrl);
  }

  saveFavorite(film: Film): Observable<Favorite> {
    const user = this.authService.getCurrentUser();
    if (!user) {
      console.error("Aucun utilisateur connecté");
      return throwError(() => new Error("Utilisateur non connecté"));
    }

    const payload = {
      userId: user.id,
      filmId: film.id,
      filmTitle: film.title,
      filmImage: film.image,
      createdAt: new Date().toISOString()
    };

    return this.http.post<Favorite>(this.favoritesUrl, payload);
  }

removeFavorite(filmId: string): Observable<void> {
  const user = this.authService.getCurrentUser();
  if (!user) {
    return throwError(() => new Error("Utilisateur non connecté"));
  }

  // On récupère le favori appartenant AU BON USER + FILM
  return this.http.get<any[]>(`${this.favoritesUrl}?userId=${user.id}&filmId=${filmId}`).pipe(
    switchMap(favorites => {
      if (!favorites || favorites.length === 0) {
        return throwError(() => new Error("Favori introuvable"));
      }

      // ID réel du favori dans json-server
      const favId = favorites[0].id;
      return this.http.delete<void>(`${this.favoritesUrl}/${favId}`);
    })
  );
}

loadUserFavorites(): Observable<Favorite[]> {
    const user = this.authService.getCurrentUser();
    if (!user) return throwError(() => new Error('Utilisateur non connecté'));
    return this.http.get<Favorite[]>(`${this.favoritesUrl}?userId=${user.id}`).pipe(
      tap(favs => {
        this.favorites = new Set(favs.map(f => String(f.filmId)));
      })
    );
  }

  isFavorite(filmId: string | undefined): boolean {
    if (!filmId) return false;
    return this.favorites.has(filmId);
  }
}