import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { User } from '../models/user.model';
import { AuthService } from '../auth/auth.service';
import { Reservation } from '../models/reservation.model';

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
  private url = 'http://localhost:3000/reservations';

  constructor(private http: HttpClient, private authService: AuthService) { }

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
        this.http.get<Reservation[]>(`${this.url}?userId=${this.user?.id}`).subscribe({
          next: data => {
            this.reservations = data;
            this.loading = false;
          },
          error: err => {
            console.error('Erreur de chargement des favoris', err);
            this.loading = false;
          }
        });
  }

  cancelReservation(id: string): void {
    const fav = this.reservations.find(f => f.id === id);
    if (!fav) return;

    this.http.delete(`${this.url}/${fav.id}`).subscribe({
      next: () => {
        this.reservations = this.reservations.filter(f => f.id !== fav.id);
      },
      error: err => console.error('Erreur lors de la suppression', err)
    });
  }
}
