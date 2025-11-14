import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { User } from '../models/user.model';
import { AuthService } from '../auth/auth.service';
import { Favorite } from '../models/favorite.model';
import { FavaritesService } from '../shared/services/favorites/favarites.service';

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
    private authService: AuthService,
    private favaritesService: FavaritesService
  ) { }

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    if (this.user) {
      this.loadFavorites();
    } else {
      console.warn('Aucun utilisateur connecté');
    }
  }

  loadFavorites(): any {
    this.loading = true;
    this.favaritesService.loadFavorites().subscribe({
      next: (data: Favorite[]) => {
        this.favorites = data;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Erreur lors du chargement des favoris', err);
        this.loading = false;
      }
    });
  }

  removeFavorite(favoriteId: string): void {
    this.favaritesService.removeFavorite(favoriteId).subscribe({
      next: () => {
        this.favorites = this.favorites.filter(f => f.id !== favoriteId);
      },
      error: (err) => console.error('Erreur suppression favori :', err)
    });
  }

}
