export interface Favorite {
  id: string;
  userId: string;      // 🧠 pour relier le favori à un utilisateur
  filmId: string;
  filmTitle: string;
  filmImage: string;
  createdAt: string;
}
