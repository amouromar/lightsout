import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLongPress } from '../hooks/useLongPress';

interface TimerDisplayProps {
  hours: number;
  minutes: number;
  onIncrementHour?: () => void;
  onDecrementHour?: () => void;
  onIncrementMinute?: () => void;
  onDecrementMinute?: () => void;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
  hours,
  minutes,
  onIncrementHour,
  onDecrementHour,
  onIncrementMinute,
  onDecrementMinute,
}) => {
  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  const hourIncPress = useLongPress(onIncrementHour);
  const hourDecPress = useLongPress(onDecrementHour);
  const minIncPress = useLongPress(onIncrementMinute);
  const minDecPress = useLongPress(onDecrementMinute);

  return (
    <View className="items-center justify-center py-6">
      <View className="flex-row items-center justify-center space-x-6">
        {/* Hours Column */}
        <View className="items-center">
          <TouchableOpacity {...hourIncPress} className="p-2" testID="hour-increment">
            <MaterialCommunityIcons name="chevron-up" size={32} color="#4b5563" />
          </TouchableOpacity>
          <View className="h-40 w-32 items-center justify-center rounded-3xl border border-white/10 bg-surface shadow-lg">
            <Text className="font-outfit text-7xl text-white">{formatNumber(hours)}</Text>
          </View>
          <TouchableOpacity {...hourDecPress} className="p-2" testID="hour-decrement">
            <MaterialCommunityIcons name="chevron-down" size={32} color="#4b5563" />
          </TouchableOpacity>
          <Text className="mt-2 font-outfit text-xs font-bold tracking-widest text-gray-500">
            HOURS
          </Text>
        </View>

        {/* Separator */}
        <View className="mb-14">
          <Text className="text-4xl text-gray-600">:</Text>
        </View>

        {/* Minutes Column */}
        <View className="items-center">
          <TouchableOpacity {...minIncPress} className="p-2" testID="minute-increment">
            <MaterialCommunityIcons name="chevron-up" size={32} color="#4b5563" />
          </TouchableOpacity>
          <View className="h-40 w-32 items-center justify-center rounded-3xl border border-white/10 bg-surface shadow-lg">
            <Text className="font-outfit text-7xl text-white">{formatNumber(minutes)}</Text>
          </View>
          <TouchableOpacity {...minDecPress} className="p-2" testID="minute-decrement">
            <MaterialCommunityIcons name="chevron-down" size={32} color="#4b5563" />
          </TouchableOpacity>
          <Text className="mt-2 font-outfit text-xs font-bold tracking-widest text-gray-500">
            MINUTES
          </Text>
        </View>
      </View>
    </View>
  );
};
