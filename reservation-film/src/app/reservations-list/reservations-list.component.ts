import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reservations-list',
  standalone: false,
  templateUrl: './reservations-list.component.html',
  styleUrl: './reservations-list.component.css'
})

export class ReservationsListComponent implements OnInit {

  reservations: any[] = [];
  loading = false;
  private url = 'http://localhost:3000/reservations';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    this.loading = true;
    this.http.get<any[]>(this.url).subscribe({
      next: data => {
        this.reservations = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  cancelReservation(id: string): void {
    if (!confirm('Voulez-vous vraiment annuler cette réservation ?')) return;

    this.http.delete(`${this.url}/${id}`).subscribe({
      next: () => {
        this.reservations = this.reservations.filter(r => r.id !== id);
      }
    });
  }
}
