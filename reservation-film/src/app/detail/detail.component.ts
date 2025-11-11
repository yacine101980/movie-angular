import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-detail',
  standalone: false,
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.css'
})
export class DetailComponent implements OnInit {
  film: any = null;
  loading = false;
  error: string | null = null;
  baseUrl = 'http://localhost:3000/movies';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = 'Identifiant de film manquant';
      return;
    }
    this.loadFilm(id);
  }

  loadFilm(id: string): void {
    this.loading = true;
    this.error = null;
    this.http.get<any>(`${this.baseUrl}/${id}`).subscribe({
      next: f => {
        this.film = f;
        this.loading = false;
      },
      error: err => {
        console.error(err);
        this.error = 'Impossible de charger le film';
        this.loading = false;
      }
    });
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