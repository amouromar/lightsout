import React, { memo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface PresetCardProps {
  title: string;
  duration: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  onPress: () => void;
}

export const PresetCard = memo(({ title, duration, icon, onPress }: PresetCardProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="mb-4 w-[48%] flex-row items-center justify-between gap-4 rounded-full border border-white/5 bg-surface p-4 shadow-md">
      <View className="mb-1 mt-1">
        <MaterialCommunityIcons name={icon} size={24} color="#9ca3af" />
      </View>
      <Text className="font-outfit text-base font-bold text-white">{title}</Text>
      <Text className="font-outfit text-xs text-gray-400">{duration}</Text>
    </TouchableOpacity>
  );
});
