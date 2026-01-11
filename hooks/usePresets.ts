import { useState, useCallback, useMemo, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Preset, DEFAULT_PRESETS } from '@/constants/presets';

const CUSTOM_PRESETS_KEY = 'custom_presets';

export function usePresets() {
  const [customPresets, setCustomPresets] = useState<Preset[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load presets on mount
  useEffect(() => {
    const loadPresets = async () => {
      try {
        const stored = await AsyncStorage.getItem(CUSTOM_PRESETS_KEY);
        if (stored) {
          setCustomPresets(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Failed to load presets:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPresets();
  }, []);

  const allPresets = useMemo<Preset[]>(
    () => [...DEFAULT_PRESETS, ...customPresets],
    [customPresets]
  );

  const saveCustomPresets = useCallback(async (presets: Preset[]) => {
    try {
      setCustomPresets(presets);
      await AsyncStorage.setItem(CUSTOM_PRESETS_KEY, JSON.stringify(presets));
    } catch (error) {
      console.error('Failed to save presets:', error);
    }
  }, []);

  const addPreset = useCallback(
    async (preset: Omit<Preset, 'id' | 'isCustom'>) => {
      const newPreset: Preset = {
        ...preset,
        id: Date.now().toString(),
        isCustom: true,
      };
      await saveCustomPresets([...customPresets, newPreset]);
    },
    [customPresets, saveCustomPresets]
  );

  const deletePreset = useCallback(
    async (id: string) => {
      await saveCustomPresets(customPresets.filter((p) => p.id !== id));
    },
    [customPresets, saveCustomPresets]
  );

  return {
    allPresets,
    customPresets,
    addPreset,
    deletePreset,
    isLoading,
  };
}
