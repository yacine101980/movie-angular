import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { User } from '../models/user.model';
import { AuthService } from '../auth/auth.service';
import { Favorite } from '../models/favorite.model';

@Component({
  selector: 'app-favorites',
  standalone: false,
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css'
})
export class FavoritesComponent implements OnInit {

  loading = false;
  favorites: Favorite[] = [];
  user: User | null = null;
  private url = 'http://localhost:3000/favorites';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    if (this.user) {
      this.loadFavorites();
    } else {
      console.warn('Aucun utilisateur connecté');
    }
  }

  // ✅ Charger les favoris du user connecté
  loadFavorites(): void {
    this.loading = true;
    this.http.get<Favorite[]>(`${this.url}?userId=${this.user?.id}`).subscribe({
      next: data => {
        this.favorites = data;
        this.loading = false;
      },
      error: err => {
        console.error('Erreur de chargement des favoris', err);
        this.loading = false;
      }
    });
  }

  // ✅ Supprimer un favori
  removeFavorite(filmId: string): void {
    const fav = this.favorites.find(f => f.id === filmId);
    if (!fav) return;

    this.http.delete(`${this.url}/${fav.id}`).subscribe({
      next: () => {
        this.favorites = this.favorites.filter(f => f.id !== fav.id);
      },
      error: err => console.error('Erreur lors de la suppression', err)
    });
  }
}
