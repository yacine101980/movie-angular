import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-reservation',
  standalone: false,
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.css'
})
export class ReservationComponent implements OnInit {

  form: FormGroup;
  film: any = null;
  loadingFilm = false;
  submitting = false;
  error: string | null = null;
  success: string | null = null;

  private filmsUrl = 'http://localhost:3000/movies';
  private reservationsUrl = 'http://localhost:3000/reservations';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      seats: [1, [Validators.required, Validators.min(1)]],
      date: ['', Validators.required],
      phone: ['']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') || this.route.snapshot.queryParamMap.get('filmId');
    if (id) {
      this.loadFilm(id);
    }
  }

  loadFilm(id: string): void {
    this.loadingFilm = true;
    this.error = null;
    this.http.get<any>(`${this.filmsUrl}/${id}`).subscribe({
      next: film => {
        this.film = film;
        this.loadingFilm = false;
      },
      error: err => {
        console.error(err);
        this.error = "Impossible de charger le film.";
        this.loadingFilm = false;
      }
    });
  }

  submit(): void {
    this.error = null;
    this.success = null;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = {
      filmId: this.film?.id ?? null,
      filmTitle: this.film?.title ?? this.film?.name ?? null,
      filmImage: this.film?.image ?? null,
      name: this.form.value.name,
      email: this.form.value.email,
      seats: Number(this.form.value.seats),
      date: this.form.value.date,
      phone: this.form.value.phone,
      createdAt: new Date().toISOString()
    };

    this.submitting = true;
    this.http.post(this.reservationsUrl, payload).subscribe({
      next: _res => {
        this.success = 'Réservation enregistrée.';
        // après un court délai, revenir à la liste ou aller où tu veux
        setTimeout(() => this.router.navigate(['/']), 1200);
      },
      error: err => {
        console.error(err);
        this.error = "Erreur lors de l'enregistrement de la réservation.";
        this.submitting = false;
      },
      complete: () => {
        this.submitting = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/']);
  }

  // getters pour template
  get name() { return this.form.get('name'); }
  get email() { return this.form.get('email'); }
  get seats() { return this.form.get('seats'); }
  get date() { return this.form.get('date'); }
}