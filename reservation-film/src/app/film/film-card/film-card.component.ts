import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Film } from '../../models/film.model';

@Component({
  selector: 'app-film-card',
  templateUrl: './film-card.component.html',
  styleUrls: ['./film-card.component.css'],
  standalone: false,
})
export class FilmCardComponent {
  @Input() film!: Film;
  @Input() favorite = false;

  @Output() viewDetail = new EventEmitter<string>();
  @Output() reserve = new EventEmitter<string>();
  @Output() favoriteToggle = new EventEmitter<Film>();

  onViewDetail(): void {
    if (this.film?.id) {
      this.viewDetail.emit(this.film.id);
    }
  }

  onReserve(): void {
    if (this.film?.id) {
      this.reserve.emit(this.film.id);
    }
  }

  onToggleFavorite(event: Event): void {
    event.stopPropagation();
    this.favoriteToggle.emit(this.film);
  }
}
