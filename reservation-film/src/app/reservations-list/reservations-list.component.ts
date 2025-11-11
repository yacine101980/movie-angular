import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reservations-list',
  standalone: false,
  templateUrl: './reservations-list.component.html',
  styleUrl: './reservations-list.component.css'
})
export class ReservationsListComponent implements OnInit{
reservations: any[] = [];
  loading = false;
  error: string | null = null;
  private reservationsUrl = 'http://localhost:3000/reservations';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    this.loading = true;
    this.http.get<any[]>(this.reservationsUrl).subscribe({
      next: res => {
        this.reservations = res;
        this.loading = false;
      },
      error: err => {
        console.error(err);
        this.error = "Impossible de charger vos réservations.";
        this.loading = false;
      }
    });
  }
}
