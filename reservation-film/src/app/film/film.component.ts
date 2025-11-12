import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-film',
  standalone: false,
  templateUrl: './film.component.html',
  styleUrls: ['./film.component.css'] // corrected property name
})
export class FilmComponent implements OnInit {
  title = 'reservation-film';
  filmList: any[] = [];
  loading = false;
  error: string | null = null;
  url = 'http://localhost:3000/movies';

  // form: FormGroup;
  film: any = null;
  loadingFilm = false;
  submitting = false;
  // error: string | null = null;
  success: string | null = null;

  // changed code: selected film id to toggle details
  selectedFilmId: number | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) { }



  ngOnInit(): void {
    this.loadFilms();
    this.loadUserFavorites();
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

  private saveFavorite(film: any): void {
    const user = this.authService.getCurrentUser();
    if (!user) {
      console.error("Aucun utilisateur connecté");
      return;
    }

    const payload = {
      userId: user.id,
      filmId: film.id,
      filmTitle: film.title,
      filmImage: film.image,
      createdAt: new Date().toISOString()
    };

    this.http.post('http://localhost:3000/favorites', payload).subscribe({
      next: () => console.log('Favori ajouté avec succès !'),
      error: err => {
        console.error('Impossible de sauvegarder les favoris', err);
      }
    });
  }

  private removeFavorite(filmId: string): void {
    this.http.get<any[]>(`http://localhost:3000/favorites?filmId=${filmId}`).subscribe({
      next: (favorites) => {
        if (favorites.length > 0) {
          const favId = favorites[0].id;
          this.http.delete(`http://localhost:3000/favorites/${favId}`).subscribe({
            next: () => console.log('Favori supprimé'),
            error: err => console.error('Erreur lors de la suppression', err)
          });
        }
      },
      error: err => console.error('Erreur lors de la récupération du favori', err)
    });
  }

  favorites = new Set<number>();

  toggleFavorite(film: any, event?: Event): void {
    if (event) event.stopPropagation();

    if (!film?.id) return;

    if (this.favorites.has(film.id)) {
      this.favorites.delete(film.id);
      this.removeFavorite(film.id); // <-- suppression
    } else {
      this.favorites.add(film.id);
      this.saveFavorite(film); // <-- ajout
    }
  }



  isFavorite(id: number | undefined): boolean {
    if (id == null) return false;
    return this.favorites.has(id);
  }


  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.authService.isLoggedIn();
  }

  private loadUserFavorites(): void {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    this.http.get<any[]>(`http://localhost:3000/favorites?userId=${user.id}`).subscribe({
      next: favorites => {
        this.favorites = new Set(favorites.map(f => f.filmId));
      },
      error: err => console.error('Erreur lors du chargement des favoris', err)
    });
  }

}
