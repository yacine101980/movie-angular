export interface Reservation {
  id: string;
  userId: string;
  filmId: string;
  filmTitle: string;
  filmImage: string; // ajouté
  name: string;
  email: string;
  seats: number;
  date: string;
  phone?: string;
  createdAt: string;
}
