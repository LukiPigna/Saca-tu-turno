
export interface Booking {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  duration: number; // in minutes, e.g., 60 or 90
  organizer: string;
  players: string[];
  level: string; // Can be 'Iniciación', '3ra', etc.
  type: 'casual' | 'competitive';
  visibility: 'public' | 'private';
  notes?: string;
  price: number;
}

export interface BookedSlots {
  [date: string]: string[]; // key is YYYY-MM-DD, value is array of HH:MM
}

export interface Notification {
    id: string;
    message: string;
    timestamp: Date;
    read: boolean;
}
