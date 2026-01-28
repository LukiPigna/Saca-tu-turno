
export const TIME_SLOTS: string[] = [
  '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00',
  '17:00', '18:00', '19:00', '20:00',
  '21:00', '22:00',
];

export const MATCH_LEVELS_CASUAL: string[] = [
  'Iniciación',
  'Intermedio',
  'Avanzado',
];

export const MATCH_LEVELS_COMPETITIVE: string[] = [
  '1ra', '2da', '3ra', '4ta', '5ta', '6ta', '7ma'
];

export const PRICING_OPTIONS: { [duration: string]: { price: number; label: string } } = {
  '60': { price: 20, label: '1 hora' },
  '90': { price: 28, label: '1 hora 30 min' },
};

export const DEFAULT_DURATION = 60;
