import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-favorites',
  standalone: false,
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css'
})

export class FavoritesComponent implements OnInit {

  films: any[] = [];
  favoritesIds = new Set<number>();
  loading = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadFavorites();
    this.loadFilms();
  }

  loadFavorites(): void {
    const raw = localStorage.getItem('favorites');
    if (raw) {
      const ids = JSON.parse(raw) as number[];
      ids.forEach(id => this.favoritesIds.add(id));
    }
  }

  loadFilms(): void {
    this.loading = true;
    this.http.get<any[]>('http://localhost:3000/movies').subscribe({
      next: data => {
        this.films = data.filter(f => this.favoritesIds.has(Number(f.id)));
        this.loading = false;
      },
      error: _ => this.loading = false
    });
  }

  removeFavorite(id: number): void {
    this.favoritesIds.delete(id);
    localStorage.setItem('favorites', JSON.stringify([...this.favoritesIds]));
    this.films = this.films.filter(f => Number(f.id) !== id);
  }
}
