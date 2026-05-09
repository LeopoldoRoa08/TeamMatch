export type Sport = "Running" | "Senderismo" | "Pádel" | "Tenis" | "Vóleibol";
export type Level = "Principiante" | "Intermedio" | "Avanzado";

export interface SportEvent {
  id: string;
  title: string;
  sport: Sport;
  level: Level;
  location: string;
  zone: string;
  date: string;
  time: string;
  price: number;
  spots: number;
  joined: number;
  host: string;
  hostAvatar: string;
  image: string;
  distanceKm: number;
  x: number; // map position %
  y: number;
}
