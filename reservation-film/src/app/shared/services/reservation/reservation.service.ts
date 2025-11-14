import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import { Film } from '../../../models/film.model';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  form: FormGroup;
  film: Film | null = null;

  private filmsUrl = 'http://localhost:3000/movies';
  private reservationsUrl = 'http://localhost:3000/reservations';

  constructor(private fb: FormBuilder, private http: HttpClient, private authService: AuthService) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      seats: [1, [Validators.required, Validators.min(1)]],
      date: ['', Validators.required],
      phone: ['']
    });
  }

  loadFilm(id: string): Observable<Film> {
    return this.http.get<Film>(`${this.filmsUrl}/${id}`);
  }

  setFilm(film: Film): void {
    this.film = film;
  }

  submitReservation(film: Film, formValue: any): Observable<any> {

    if (!film) {
      return throwError(() => new Error("Film manquant"));
    }

    const payload = {
      userId: this.authService.getCurrentUser()?.id,
      filmId: film.id,
      filmTitle: film.title,
      filmImage: film.image,
      name: formValue.name,
      email: formValue.email,
      seats: formValue.seats,
      date: formValue.date,
      phone: formValue.phone || null,
      createdAt: new Date().toISOString()
    };

    return this.http.post(this.reservationsUrl, payload);
  }

}
