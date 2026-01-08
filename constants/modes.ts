import { MaterialCommunityIcons } from '@expo/vector-icons';

export type SessionMode = 'Work' | 'Study' | 'Sleep';

export interface ModeConfig {
  label: SessionMode;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  video: any;
}

export const MODES_CONFIG: ModeConfig[] = [
  {
    label: 'Work',
    icon: 'briefcase-outline',
    video: require('../assets/videos/Pin on papel.mp4'),
  },
  {
    label: 'Study',
    icon: 'book-open-variant',
    video: require('../assets/videos/Pinterest.mp4'),
  },
  {
    label: 'Sleep',
    icon: 'moon-waning-crescent',
    video: require('../assets/videos/Starssss.mp4'),
  },
];
