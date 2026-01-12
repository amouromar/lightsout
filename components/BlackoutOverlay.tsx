import React, { useMemo, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useVideoPlayer, VideoView } from 'expo-video';
import { SessionMode, MODES_CONFIG } from '../constants/modes';
import { useDeviceAPI } from '../hooks/useDeviceAPI';

// const { width, height } = Dimensions.get('window');

interface BlackoutOverlayProps {
  isVisible: boolean;
  mode: SessionMode;
  remainingTime: string;
  onExit?: () => void;
  isLocked?: boolean;
  unlockWaitTime?: string;
  locationName?: string;
}

// Sub-component to lazy-load video player only when overlay is visible
const VideoBackground = ({ video, isVisible }: { video: any; isVisible: boolean }) => {
  const [status, setStatus] = React.useState<string>('idle');
  const player = useVideoPlayer(video, (player) => {
    player.loop = true;
    player.muted = true;
    player.play();
  });

  useEffect(() => {
    const subscription = player.addListener('statusChange', (payload) => {
      setStatus(payload.status);
    });
    return () => subscription.remove();
  }, [player]);

  useEffect(() => {
    if (isVisible) {
      player.play();
    } else {
      player.pause();
    }
  }, [isVisible, player]);

  const isVideoReady = status === 'readyToPlay';

  return (
    <>
      <VideoView
        player={player}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        nativeControls={false}
      />
      {!isVideoReady && <View style={[StyleSheet.absoluteFill, { backgroundColor: '#000' }]} />}
    </>
  );
};

export const BlackoutOverlay: React.FC<BlackoutOverlayProps> = ({
  isVisible,
  mode,
  remainingTime,
  onExit,
  isLocked = true,
  unlockWaitTime,
  locationName,
}) => {
  const { setAppBrightness, restoreBrightness } = useDeviceAPI();
  const wakeTimerRef = useRef<any>(null);

  const modeConfig = useMemo(() => MODES_CONFIG.find((m) => m.label === mode), [mode]);

  const handleTouch = () => {
    if (!isVisible) return;

    // Clear any existing timer
    if (wakeTimerRef.current) {
      clearTimeout(wakeTimerRef.current);
    }

    // Wake up: restore original brightness
    restoreBrightness();

    // Set timer to dim back after 5 seconds
    wakeTimerRef.current = setTimeout(() => {
      setAppBrightness(0.01);
      wakeTimerRef.current = null;
    }, 5000);
  };

  useEffect(() => {
    return () => {
      if (wakeTimerRef.current) {
        clearTimeout(wakeTimerRef.current);
      }
    };
  }, []);

  if (!isVisible) return null;

  return (
    <Animated.View
      entering={FadeIn.duration(500)}
      exiting={FadeOut.duration(500)}
      style={StyleSheet.absoluteFill}
      className="z-50 bg-black">
      <StatusBar hidden={isVisible} animated />
      <Pressable onPress={handleTouch} style={StyleSheet.absoluteFill}>
        {/* Background Video - Lazy loaded */}
        <VideoBackground video={modeConfig?.video} isVisible={isVisible} />

        {/* Dark Overlay for readability */}
        <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.6)' }]} />

        {/* Header Info */}
        <View className="flex-row items-center justify-between px-6 pt-16">
          <View className="flex-row items-center gap-2">
            <MaterialCommunityIcons name="lock-outline" size={18} color="#ef4444" />
            <Text className="text-md font-outfit font-bold uppercase tracking-widest text-red-500">
              LOCKED
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            <MaterialCommunityIcons
              name={
                modeConfig?.icon ||
                (mode === 'Sleep' ? 'moon-waning-crescent' : 'book-open-variant')
              }
              size={18}
              color="white"
            />
            <Text className="text-md font-outfit font-bold tracking-widest text-gray-400">
              {mode} Mode
            </Text>
          </View>
        </View>

        {/* Location/Weather Context */}
        <Animated.View entering={FadeIn.delay(300)} className="absolute right-6 top-32 items-end">
          <View className="flex-row items-center gap-2">
            <Text className="font-outfit text-sm text-gray-400">
              {locationName || 'Local Area'}
            </Text>
            <MaterialCommunityIcons name="map-marker" size={12} color="#6366f1" />
          </View>
          <View className="mt-1 flex-row items-center gap-2">
            <Text className="font-outfit text-xs font-medium text-gray-500">Clear Skies</Text>
            <MaterialCommunityIcons name="weather-sunny" size={12} color="#facc15" />
          </View>
        </Animated.View>

        {/* Main Content */}
        <View className="-mt-20 flex-1 items-center justify-center">
          {/* Circular Timer Ring */}
          <View className="items-center justify-center">
            <View className="h-80 w-80 items-center justify-center rounded-full">
              <Text className="font-outfit text-7xl font-light text-white opacity-90">
                {remainingTime}
              </Text>
              <Text className="mt-2 font-outfit text-sm font-bold uppercase tracking-[8px] text-gray-500">
                REMAINING
              </Text>
            </View>
          </View>

          {/* Override Card */}
          {isLocked && (
            <View className="mt-20 w-fit flex-row items-center gap-4 space-x-4 rounded-3xl border border-white/5 bg-surface/80 p-4">
              <View className="rounded-2xl bg-white/5 p-3">
                <MaterialCommunityIcons name="shield-alert-outline" size={24} color="#9ca3af" />
              </View>
              <View className="flex-col gap-2">
                <Text className="font-outfit font-bold text-gray-300">
                  Override in {unlockWaitTime}
                </Text>
                <Text className="font-outfit text-xs text-gray-500">20% rule active</Text>
              </View>
            </View>
          )}
        </View>

        {/* Footer Exit Button */}
        <BlurView intensity={20} className="absolute bottom-0 left-0 right-0 px-6 pb-10 pt-6">
          <TouchableOpacity
            onPress={onExit}
            disabled={isLocked}
            className={`flex-row items-center justify-center gap-2 overflow-hidden rounded-full py-7 ${isLocked ? 'opacity-40' : 'bg-accent/20'}`}>
            <MaterialCommunityIcons
              name={isLocked ? 'lock-outline' : 'power'}
              size={24}
              color="white"
            />
            <Text className="font-outfit text-xl font-bold tracking-widest text-white">
              {isLocked ? 'Session Locked' : 'End Session'}
            </Text>
          </TouchableOpacity>
        </BlurView>
      </Pressable>
    </Animated.View>
  );
};
