import React, { memo } from 'react';
import { View, Text, TouchableOpacity, Modal, Pressable } from 'react-native';
import { BlurView } from 'expo-blur';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeIn, SlideInDown, SlideOutDown } from 'react-native-reanimated';

interface LocationInfoBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
}

export const LocationInfoBottomSheet = memo(
  ({ isVisible, onClose }: LocationInfoBottomSheetProps) => {
    if (!isVisible) return null;

    return (
      <Modal transparent visible={isVisible} animationType="none" onRequestClose={onClose}>
        <View className="flex-1 justify-end">
          <Pressable className="absolute inset-0 bg-black/50" onPress={onClose}>
            <Animated.View entering={FadeIn} className="absolute inset-0">
              <BlurView intensity={20} tint="dark" className="absolute inset-0" />
            </Animated.View>
          </Pressable>

          <Animated.View
            entering={SlideInDown.duration(400)}
            exiting={SlideOutDown}
            className="rounded-t-[32px] border border-white/5 bg-[#111] p-6 pb-10">
            <View className="mb-6 h-1 w-10 self-center rounded-full bg-white/10" />

            <View className="mb-6 flex-row items-center gap-4">
              <View className="h-14 w-14 items-center justify-center rounded-2xl bg-[#6366f1]/10">
                <MaterialCommunityIcons name="map-marker-radius" size={28} color="#6366f1" />
              </View>
              <Text className="font-outfit-bold text-2xl text-white">Location Transparency</Text>
            </View>

            <View className="mb-8 gap-5">
              <Text className="font-outfit text-base leading-6 text-gray-400">
                LightsOut uses your location to provide context for your focus sessions.
              </Text>

              <View className="flex-row items-center gap-3">
                <MaterialCommunityIcons name="weather-partly-cloudy" size={20} color="#9ca3af" />
                <Text className="font-outfit text-sm text-gray-300">
                  Weather data synced to your current area.
                </Text>
              </View>

              <View className="flex-row items-center gap-3">
                <MaterialCommunityIcons name="clock-outline" size={20} color="#9ca3af" />
                <Text className="font-outfit text-sm text-gray-300">
                  Accurate local time based on your timezone.
                </Text>
              </View>

              <View className="mt-2 flex-row items-center gap-3 rounded-2xl bg-[#10b981]/5 p-4">
                <MaterialCommunityIcons name="shield-check-outline" size={24} color="#10b981" />
                <Text className="flex-1 font-outfit text-[13px] leading-5 text-[#10b981]">
                  Your location is processed locally and never stored or shared with any third
                  parties.
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={onClose}
              activeOpacity={0.8}
              className="h-14 items-center justify-center rounded-full bg-white">
              <Text className="font-outfit-bold text-base text-black">OK</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    );
  }
);
