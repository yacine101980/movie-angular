import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { User } from '../models/user.model';
import { AuthService } from '../auth/auth.service';
import { Reservation } from '../models/reservation.model';
import { ReservationsListService } from '../shared/services/reservations-list/reservations-list.service';

@Component({
  selector: 'app-reservations-list',
  standalone: false,
  templateUrl: './reservations-list.component.html',
  styleUrl: './reservations-list.component.css'
})

export class ReservationsListComponent implements OnInit {

  reservations: Reservation[] = [];
  loading = false;
  user: User | null = null;

  constructor(private http: HttpClient, private authService: AuthService,
    private reservationsListService: ReservationsListService
  ) { }

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    if (this.user) {
      this.loadReservations();
    } else {
      console.warn('Aucun utilisateur connecté');
    }

  }

  loadReservations(): void {
    this.loading = true;
    this.reservationsListService.loadReservations().subscribe({
      next: (data: Reservation[]) => {
        this.reservations = data;
        this.loading = false;
      },
      error: err => {
        console.error('Erreur lors du chargement des réservations', err);
        this.loading = false;
      }
    });
  }

  cancelReservation(reservationId: string): void {
    this.reservationsListService.cancelReservation(reservationId).subscribe({
      next: () => {
        this.reservations = this.reservations.filter(r => r.id !== reservationId);
      },
      error: err => console.error('Erreur suppression réservation :', err)
    });
  }
}
