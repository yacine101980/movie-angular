import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-film',
  standalone: false,
  templateUrl: './film.component.html',
  styleUrls: ['./film.component.css'] // corrected property name
})
export class FilmComponent implements OnInit{
  title = 'reservation-film';
  filmList: any[] = [];
  loading = false;
  error: string | null = null;
  url = 'http://localhost:3000/movies';

  // changed code: selected film id to toggle details
  selectedFilmId: number | null = null;

  // new: favorites set (ids)
  favorites = new Set<number>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}
  ngOnInit(): void {
    this.loadFavorites();
    this.loadFilms();
  }

  loadFilms(): void {
    this.loading = true;
    this.error = null;
    this.http.get<any[]>(this.url).subscribe({
      next: films => {
        this.filmList = films;
        this.loading = false;
      },
      error: err => {
        this.error = 'Impossible de charger les films';
        console.error(err);
        this.loading = false;
      }
    });
  }

  trackById(index: number, item: any): any {
    return item.id ?? index;
  }

  // changed code: toggle details
  toggleDetails(id: number | undefined): void {
    if (id == null) { this.selectedFilmId = null; return; }
    this.selectedFilmId = this.selectedFilmId === id ? null : id;
  }

  navigateToDetail(id: number | undefined): void {
    if (id != null) {
      this.router.navigate(['/detail', id]);
    }
  }

  navigateToReservation(id: number | undefined): void {
    if (id != null) {
      this.router.navigate(['/reservation', id]);
    }
  }

  // --- Favorites logic ---
  private loadFavorites(): void {
    try {
      const raw = localStorage.getItem('favorites');
      if (raw) {
        const arr = JSON.parse(raw) as number[];
        arr.forEach(id => this.favorites.add(Number(id)));
      }
    } catch (e) {
      console.error('Impossible de charger les favoris', e);
    }
  }

  private saveFavorites(): void {
    try {
      localStorage.setItem('favorites', JSON.stringify(Array.from(this.favorites)));
    } catch (e) {
      console.error('Impossible de sauvegarder les favoris', e);
    }
  }

  toggleFavorite(id: number | undefined, event?: Event): void {
    if (event) { event.stopPropagation(); } // prevent row clicks
    if (id == null) return;
    if (this.favorites.has(id)) {
      this.favorites.delete(id);
    } else {
      this.favorites.add(id);
    }
    this.saveFavorites();
  }

  isFavorite(id: number | undefined): boolean {
    if (id == null) return false;
    return this.favorites.has(id);
  }

  get favoritesCount(): number {
    return this.favorites.size;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.authService.isLoggedIn();
  }

}
