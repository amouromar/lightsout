import { MaterialCommunityIcons } from '@expo/vector-icons';

export type SessionMode = 'Work' | 'Study' | 'Sleep';

export interface ModeConfig {
  label: SessionMode;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  video: any;
}

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const VIDEOS_BUCKET_URL = `${SUPABASE_URL}/storage/v1/object/public/videos`;

export const MODES_CONFIG: ModeConfig[] = [
  {
    label: 'Work',
    icon: 'briefcase-outline',
    video: `${VIDEOS_BUCKET_URL}/work.mp4`,
  },
  {
    label: 'Study',
    icon: 'book-open-variant',
    video: `${VIDEOS_BUCKET_URL}/study.mp4`,
  },
  {
    label: 'Sleep',
    icon: 'moon-waning-crescent',
    video: `${VIDEOS_BUCKET_URL}/sleep.mp4`,
  },
];
