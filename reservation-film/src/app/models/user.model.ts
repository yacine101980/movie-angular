export interface User {
  id: string;
  username: string;
  email: string;
  password?: string;
  favorites: string[];      // liste des IDs de films favoris
  reservations: string[];   // liste des IDs de réservations
}
