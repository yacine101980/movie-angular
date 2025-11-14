import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Film } from '../../../models/film.model';

@Injectable({
  providedIn: 'root'
})
export class DetailService {

  film: any = null;
  loading = false;
  error: string | null = null;
  baseUrl = 'http://localhost:3000/movies';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  // detail.service.ts
loadFilm(id: string): Observable<Film> {
  this.loading = true;
  this.error = null;
  return this.http.get<Film>(`${this.baseUrl}/${id}`);
}


  navigateToReservation(id: number | undefined): void {
    if (id != null) {
      this.router.navigate(['/reservation', id]);
    }
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
