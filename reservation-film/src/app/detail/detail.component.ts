import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DetailService } from '../shared/services/detail/detail.service';

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

  constructor(
    private route: ActivatedRoute,
    private detailService: DetailService
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
  
  this.detailService.loadFilm(id).subscribe({
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
    this.detailService.navigateToReservation(id);
  }

  goBack(): void {
    this.detailService.goBack();
  } 

}