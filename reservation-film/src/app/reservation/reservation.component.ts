import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { ReservationService } from '../shared/services/reservation/reservation.service';
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

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private reservationService: ReservationService
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
    this.reservationService.loadFilm(id).subscribe({
      next: (film) => {
        this.film = film;
        this.reservationService.setFilm(film); // 💥 IMPORTANT
        this.loadingFilm = false;
      },
      error: () => {
        this.error = "Erreur lors du chargement du film.";
        this.loadingFilm = false;
      }
    });
  }

  submit(): void {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;

    this.reservationService.submitReservation(this.film, this.form.value)
      .subscribe({
        next: () => {
          this.success = "Réservation réussie !";
          this.submitting = false;
          this.form.reset();
        },
        error: () => {
          this.error = "Erreur lors de la soumission de la réservation.";
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