import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import { TimerDisplay } from '@/components/TimerDisplay';
import { ModeSelector, SessionMode } from '@/components/ModeSelector';
import { PresetCard } from '@/components/PresetCard';

import { Preset } from '@/constants/presets';
import { BlackoutOverlay } from '@/components/BlackoutOverlay';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { format } from 'date-fns';
import { useDeviceAPI } from '@/hooks/useDeviceAPI';
import { usePresets } from '@/hooks/usePresets';
import { PresetsBottomSheet } from '@/components/PresetsBottomSheet';
import * as Haptics from 'expo-haptics';

export default function Home() {
  const [mode, setMode] = useState<SessionMode>('Work');
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(25);
  const [isActive, setIsActive] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [isLocked, setIsLocked] = useState(true);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [locationName, setLocationName] = useState('Loading location...');
  const [isPresetsVisible, setIsPresetsVisible] = useState(false);

  const { allPresets, addPreset, deletePreset } = usePresets();

  const insets = useSafeAreaInsets();
  const {
    setAppBrightness,
    restoreBrightness,
    toggleWifi,
    updateLockscreenCountdown,
    clearNotification,
  } = useDeviceAPI();

  // Timer logic
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000 * 60); // Update every minute
    return () => clearInterval(timer);
  }, []);

  // Location logic
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationName('Location denied');
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({});
        let reverseGeocode = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        if (reverseGeocode.length > 0) {
          const item = reverseGeocode[0];
          const city = item.city || item.district || '';
          const region = item.region || item.subregion || '';
          setLocationName(
            city && region ? `${city}, ${region}` : city || region || 'Unknown location'
          );
        }
      } catch (error) {
        alert(error);
        setLocationName('Location unavailable');
      }
    })();
  }, []);

  // Timer logic
  useEffect(() => {
    let interval: any;
    if (isActive && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => {
          const next = prev - 1;
          updateLockscreenCountdown(next);
          return next;
        });

        // 20% rule check
        setTotalSeconds((total) => {
          setSecondsRemaining((prev) => {
            const elapsed = total - prev;
            if (elapsed >= total * 0.2) {
              setIsLocked(false);
            }
            return prev;
          });
          return total;
        });
      }, 1000);
    } else if (secondsRemaining === 0 && isActive) {
      setIsActive(false);
      restoreBrightness();
      clearNotification();
    }
    return () => clearInterval(interval);
  }, [isActive, secondsRemaining, updateLockscreenCountdown, restoreBrightness, clearNotification]);

  const startSession = useCallback(() => {
    const total = hours * 3600 + minutes * 60;
    if (total === 0) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTotalSeconds(total);
    setSecondsRemaining(total);
    setIsActive(true);
    setIsLocked(true);

    // Device API Controls
    setAppBrightness(0.01);
    toggleWifi(false);
    updateLockscreenCountdown(total);
  }, [hours, minutes, setAppBrightness, toggleWifi, updateLockscreenCountdown]);

  const formatTime = useCallback((totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }, []);

  const getUnlockWaitTime = useCallback(() => {
    const threshold = Math.ceil(totalSeconds * 0.2);
    const elapsed = totalSeconds - secondsRemaining;
    const remainingToUnlock = Math.max(0, threshold - elapsed);
    if (remainingToUnlock >= 60) {
      return `${Math.ceil(remainingToUnlock / 60)} min`;
    }
    return `${remainingToUnlock} sec`;
  }, [totalSeconds, secondsRemaining]);

  const setPreset = useCallback((preset: Preset) => {
    Haptics.selectionAsync();
    setHours(preset.hours);
    setMinutes(preset.minutes);
  }, []);

  const onIncrementHour = useCallback(() => setHours((h) => Math.min(23, h + 1)), []);
  const onDecrementHour = useCallback(() => setHours((h) => Math.max(0, h - 1)), []);
  const onIncrementMinute = useCallback(() => setMinutes((m) => (m + 1) % 60), []);
  const onDecrementMinute = useCallback(() => setMinutes((m) => (m - 1 + 60) % 60), []);
  const onModeChange = useCallback((m: SessionMode) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setMode(m);
  }, []);
  const onPresetsClose = useCallback(() => setIsPresetsVisible(false), []);
  const onPresetsOpen = useCallback(() => setIsPresetsVisible(true), []);
  const onExitOverlay = useCallback(() => {
    setIsActive(false);
    restoreBrightness();
    clearNotification();
  }, [restoreBrightness, clearNotification]);

  return (
    <View className="flex-1 bg-background">
      <StatusBar style="light" translucent backgroundColor="transparent" animated />
      <Stack.Screen options={{ headerShown: false }} />

      {/* Fixed Status Bar Background */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: insets.top,
          backgroundColor: '#0a0a0a',
          zIndex: 50,
        }}
      />

      <ScrollView
        className="flex-1"
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: insets.top + 2,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="mb-8 mt-8">
          <Text className="mb-2 font-outfit text-4xl font-bold text-white">Hello!</Text>
          <View className="flex-row items-center space-x-2">
            <Text className="font-outfit text-sm text-gray-400">
              {format(currentTime, 'hh:mm a')}
            </Text>
            <Text className="text-gray-600">·</Text>
            <MaterialCommunityIcons name="map-marker" size={14} color="#6366f1" />
            <Text className="font-outfit text-sm text-gray-400">{locationName}</Text>
          </View>
        </View>

        {/* Mode Selection */}
        <View className="mb-8">
          <Text className="mb-4 font-outfit text-xs font-bold uppercase tracking-widest text-gray-500">
            MODE
          </Text>
          <ModeSelector selectedMode={mode} onModeChange={onModeChange} />
        </View>

        {/* Duration Picker */}
        <View className="mb-8">
          <Text className="mb-4 font-outfit text-xs font-bold uppercase tracking-widest text-gray-500">
            DURATION
          </Text>
          <TimerDisplay
            hours={hours}
            minutes={minutes}
            onIncrementHour={onIncrementHour}
            onDecrementHour={onDecrementHour}
            onIncrementMinute={onIncrementMinute}
            onDecrementMinute={onDecrementMinute}
          />
        </View>

        {/* Quick Presets */}
        <View className="mb-20">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="font-outfit text-xs font-bold uppercase tracking-widest text-gray-500">
              QUICK PRESETS
            </Text>
            <TouchableOpacity onPress={onPresetsOpen} hitSlop={50}>
              <Text className="font-outfit text-xs font-bold text-gray-400">SEE ALL</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row flex-wrap justify-between">
            {allPresets.slice(0, 4).map((preset: Preset) => (
              <PresetCard
                key={preset.id}
                title={preset.title}
                duration={`${preset.hours > 0 ? preset.hours + 'h ' : ''}${preset.minutes}m`}
                icon={preset.icon as any}
                onPress={() => setPreset(preset)}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 px-6 pb-10 pt-6">
        <TouchableOpacity
          onPress={startSession}
          className="items-center overflow-hidden rounded-full border border-white/10 py-7 shadow-2xl">
          <LinearGradient
            colors={['#365314', '#713f12']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0 }}
          />
          <BlurView
            tint="dark"
            style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, opacity: 0.5 }}
          />
          <Text className="font-outfit text-xl font-bold tracking-widest text-gray-300">
            Lights Out
          </Text>
        </TouchableOpacity>
      </View>

      {/* Immersive Overlay */}
      <BlackoutOverlay
        isVisible={isActive}
        mode={mode}
        remainingTime={formatTime(secondsRemaining)}
        isLocked={isLocked}
        unlockWaitTime={getUnlockWaitTime()}
        onExit={onExitOverlay}
      />

      {/* Presets Slide-up Menu */}
      <PresetsBottomSheet
        isVisible={isPresetsVisible}
        onClose={onPresetsClose}
        presets={allPresets}
        onSelectPreset={setPreset}
        onAddPreset={addPreset}
        onDeletePreset={deletePreset}
      />
    </View>
  );
}
