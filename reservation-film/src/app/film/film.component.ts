import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Film } from '../models/film.model';
import { FilmService } from '../shared/services/film/film.service';
import { Favorite } from '../models/favorite.model';

@Component({
  selector: 'app-film',
  standalone: false,
  templateUrl: './film.component.html',
  styleUrls: ['./film.component.css']
})
export class FilmComponent implements OnInit {
  favorites = new Set<string>();
  filmList: any[] = [];
  loading = false;
  error: string | null = null;

  film: Film[] = [];
  loadingFilm = false;
  submitting = false;
  favoritesList: Favorite[] = [];
  success: string | null = null;
  selectedFilmId: number | null = null;

  constructor(
    private router: Router,
    private authService: AuthService,
    private filmService: FilmService
  ) { }

  ngOnInit(): void {
    this.loadFilms();
    this.loadUserFavorites();
  }

  loadFilms(): void {
    this.filmService.loadFilms().subscribe({
      next: (data: Film[]) => {
        this.filmList = data;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Erreur lors du chargement des films', err);
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

  navigateToDetail(id: string | number | undefined): void {
    if (id != null) {
      this.router.navigate(['/detail', id]);
    }
  }

  navigateToReservation(id: string | number | undefined): void {
    if (id != null) {
      this.router.navigate(['/reservation', id]);
    }
  }

  private saveFavorite(film: any): void {
    const user = this.authService.getCurrentUser();
    if (!user) {
      console.error("Aucun utilisateur connecté");
      return;
    }

    this.filmService.saveFavorite(film).subscribe({
      next: () => {
        console.log('Favori ajouté')
      },
      error: (err) => {
        console.error('Erreur lors de l\'ajout du favori', err);
      }
    });
  }

  removeFavorite(filmId: string): void {
    this.filmService.removeFavorite(filmId).subscribe({
      next: () => {
        console.log("Favori supprimé !");
        this.favorites.delete((filmId));
      },
      error: err => console.error(err)
    });
  }

  private loadUserFavorites(): void {
    this.filmService.loadUserFavorites().subscribe({
      next: (favs) => {
        this.favorites = new Set(favs.map(f => String(f.filmId)));
      },
      error: err => {
        console.error('Erreur chargement favoris', err);
      }
    });
  }

  toggleFavorite(film: Film): void {
    if (!film?.id) return;

    if (this.favorites.has(film.id)) {
      this.favorites.delete(film.id);
      this.filmService.removeFavorite(film.id).subscribe({
        next: () => console.log("Favori supprimé"),
        error: err => console.error("Erreur suppression favori", err)
      });

    } else {
      this.favorites.add(film.id);
      this.filmService.saveFavorite(film).subscribe({
        next: () => console.log("Favori ajouté"),
        error: err => console.error("Erreur ajout favori", err)
      });
    }
  }

  isFavorite(id: string| undefined): boolean { 
    if (id == null) return false; return this.favorites.has(id); 
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.authService.isLoggedIn();
  }

}
