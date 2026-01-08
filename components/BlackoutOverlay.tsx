import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useVideoPlayer, VideoView } from 'expo-video';
import { SessionMode, MODES_CONFIG } from '../constants/modes';

const { width, height } = Dimensions.get('window');

interface BlackoutOverlayProps {
  isVisible: boolean;
  mode: SessionMode;
  remainingTime: string;
  onExit?: () => void;
  isLocked?: boolean;
  unlockWaitTime?: string;
}

export const BlackoutOverlay: React.FC<BlackoutOverlayProps> = ({
  isVisible,
  mode,
  remainingTime,
  onExit,
  isLocked = true,
  unlockWaitTime,
}) => {
  const modeConfig = MODES_CONFIG.find((m) => m.label === mode);

  const player = useVideoPlayer(modeConfig?.video, (player) => {
    player.loop = true;
    player.muted = true;
    player.play();
  });

  if (!isVisible) return null;

  return (
    <Animated.View
      entering={FadeIn.duration(500)}
      exiting={FadeOut.duration(500)}
      style={StyleSheet.absoluteFill}
      className="z-50 bg-black">
      {/* Video Background */}
      <VideoView
        player={player}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        nativeControls={false}
      />

      {/* Dark Overlay for readability */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.5)' }]} />

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
              modeConfig?.icon || (mode === 'Sleep' ? 'moon-waning-crescent' : 'book-open-variant')
            }
            size={18}
            color="white"
          />
          <Text className="text-md font-outfit font-bold tracking-widest text-gray-400">
            {mode} Mode
          </Text>
        </View>
      </View>

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
          <View className="mt-20 w-3/4 flex-row items-center gap-4 space-x-4 rounded-3xl border border-white/5 bg-surface/80 p-4">
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
    </Animated.View>
  );
};
