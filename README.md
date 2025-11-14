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

🧠 Fonctionnement des Réservations


🛠 Technologies utilisées

Angular 17

TypeScript

JSON-Server (fake backend)

RxJS

Angular Router

FormBuilder + Validators
