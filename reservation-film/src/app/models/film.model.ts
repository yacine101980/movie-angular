export interface Film {
  id: string;
  title: string;
  name?: string;
  genre: string;
  image: string;
  director?: string;
  duration?: number;
  releaseDate?: number;
  description?: string;
  favoris: boolean;
  now_playing: boolean;
}
