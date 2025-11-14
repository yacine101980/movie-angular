🎬 MovieApp — Application de Films avec Favoris & Réservations

MovieApp est une application Angular permettant aux utilisateurs de :

✔️ Consulter la liste des films
✔️ Voir les détails d’un film
✔️ Réserver une séance
✔️ Ajouter/enlever des films de leurs favoris
✔️ Gérer leurs favoris et réservations (uniquement visibles par l’utilisateur connecté)
✔️ Se connecter / se déconnecter

🚀 Fonctionnalités
🔐 Authentification

Login simple via AuthService

Stockage de l’utilisateur en localStorage

Protection des favoris & réservations (lié au userId)

⭐ Favoris

Ajout / suppression d’un film des favoris

Bouton étoile dynamique (★ / ☆)

Favoris stockés dans db.json (JSON-Server)

Liaison 1 utilisateur → N favoris

🎟️ Réservations

Formulaire complet avec validation

Réservation liée au film + utilisateur

Liste des réservations personnelles

🎞️ Films

Affichage général des films

Détails du film

Navigation Angular Router

📁 Structure du projet
src/
 ├── app/
 │   ├── auth/
 │   │   └── auth.service.ts
 │   ├── film/
 │   │   ├── film.component.ts
 │   │   ├── film.component.html
 │   │   └── film.component.css
 │   ├── models/
 │   │   ├── film.model.ts
 │   │   ├── user.model.ts
 │   │   └── favorite.model.ts
 │   ├── reservation/
 │   │   ├── reservation.component.ts
 │   │   ├── reservation.component.html
 │   │   └── reservation.component.css
 │   ├── shared/
 │   │   ├── services/
 │   │   │   ├── film/
 │   │   │   │   └── film.service.ts
 │   │   │   └── reservation/
 │   │   │       └── reservation.service.ts
 │   │   └── ...
 │   └── app.module.ts
 └── ...

🔧 Installation & Lancement
1️⃣ Installer les dépendances
npm install

2️⃣ Démarrer Angular
ng serve


➡️ Accès : http://localhost:4200/

3️⃣ Démarrer JSON-Server

Dans un autre terminal :

json-server --watch db.json --port 3000


Endpoints utilisés :

Ressource	URL
Films	/movies
Favoris	/favorites
Réservations	/reservations
🧠 Fonctionnement des Favoris

Chaque favori comporte :

{
  "id": "auto",
  "userId": "USER_ID",
  "filmId": "FILM_ID",
  "filmTitle": "Titre",
  "filmImage": "URL",
  "createdAt": "date"
}

Exemple d’ajout
saveFavorite(film: Film) {
  const user = this.authService.getCurrentUser();
  return this.http.post<Favorite>('http://localhost:3000/favorites', {
    userId: user.id,
    filmId: film.id,
    filmTitle: film.title,
    filmImage: film.image,
    createdAt: new Date().toISOString()
  });
}

Exemple de suppression
removeFavorite(favoriteId: string) {
  return this.http.delete(`http://localhost:3000/favorites/${favoriteId}`);
}

🧠 Fonctionnement des Réservations

Payload envoyé :

{
  "userId": "USER_ID",
  "filmId": "FILM_ID",
  "filmTitle": "Titre",
  "filmImage": "Image",
  "name": "Nom",
  "email": "Email",
  "seats": 2,
  "date": "2025-01-01",
  "phone": null,
  "createdAt": "date"
}

🛠 Technologies utilisées

Angular 17

TypeScript

JSON-Server (fake backend)

RxJS

Angular Router

FormBuilder + Validators

📸 Aperçu du composant Favoris
Bouton étoile dynamique
<button 
  class="fav-btn"
  [class.active]="isFavorite(film.id)" 
  (click)="toggleFavorite(film, $event)"
>
  <span *ngIf="isFavorite(film.id)">★</span>
  <span *ngIf="!isFavorite(film.id)">☆</span>
</button>

💡 Améliorations futures

🔐 JWT Auth + vrai backend

👤 Page "Profil"

🎬 Système d’avis / notes

💳 Paiement des réservations

📱 Version mobile responsive
