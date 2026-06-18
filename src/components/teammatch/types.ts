export type Sport = "Running" | "Senderismo" | "Pádel" | "Tenis" | "Vóleibol" | "Fútbol" | "Golf";
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
  lat: number;
  lng: number;
  description_after_arrival?: string;
}

export interface Clan {
  id: string;
  name: string;
  sport: Sport;
  captain_id: string;
  invite_code: string;
  hex_primary: string;
  hex_secondary: string;
  matches_played: number;
  matches_won: number;
  matches_lost: number;
  created_at: string;
}

export interface ClanMember {
  id: string;
  clan_id: string;
  user_id: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  profiles?: {
    username: string;
    avatar_url: string;
    rating: number;
    full_name?: string;
  };
}
