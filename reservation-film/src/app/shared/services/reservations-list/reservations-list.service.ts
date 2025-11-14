import { Injectable } from '@angular/core';
import { Reservation } from '../../../models/reservation.model';
import { User } from '../../../models/user.model';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../auth/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservationsListService {

  reservations: Reservation[] = [];
  loading = false;
  user: User | null = null;
  private url = 'http://localhost:3000/reservations';

  constructor(private http: HttpClient, private authService: AuthService) { }


  loadReservations(): Observable<Reservation[]> {
    const userId = this.authService.getCurrentUser()?.id;
    return this.http.get<Reservation[]>(`${this.url}?userId=${userId}`);
  }

  cancelReservation(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
