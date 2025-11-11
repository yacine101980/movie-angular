import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-favorites',
  standalone: false,
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css'
})
export class FavoritesComponent implements OnInit {

  loading = false;
  favorites: any[] = [];
  private url = 'http://localhost:3000/favorites';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites(): void {
    this.loading = true;
    this.http.get<any[]>(this.url).subscribe({
      next: data => {
        this.favorites = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  removeFavorite(id: string): void {
    this.http.delete(`${this.url}/${id}`).subscribe({
      next: () => {
        this.favorites = this.favorites.filter(f => f.id !== id);
      }
    });
  }
}
