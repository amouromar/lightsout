export interface Preset {
  id: string;
  title: string;
  hours: number;
  minutes: number;
  icon: string;
  isCustom?: boolean;
}

export const DEFAULT_PRESETS: Preset[] = [
  {
    id: 'cooking',
    title: 'Cooking',
    hours: 0,
    minutes: 20,
    icon: 'pot-mix',
  },
  {
    id: 'workout',
    title: 'Workout',
    hours: 0,
    minutes: 50,
    icon: 'weight-lifter',
  },
  {
    id: 'cleaning',
    title: 'Cleaning',
    hours: 0,
    minutes: 50,
    icon: 'bucket',
  },
  {
    id: 'laundry',
    title: 'Laundry',
    hours: 0,
    minutes: 25,
    icon: 'washing-machine',
  },
];
