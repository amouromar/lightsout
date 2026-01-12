import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
  Pressable,
} from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { BlurView } from 'expo-blur';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Preset } from '@/constants/presets';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAX_TRANSLATE_Y = -SCREEN_HEIGHT + 50;

interface PresetsBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  presets: Preset[];
  onSelectPreset: (preset: Preset) => void;
  onAddPreset: (preset: Omit<Preset, 'id' | 'isCustom'>) => void;
  onDeletePreset: (id: string) => void;
}

export function PresetsBottomSheet({
  isVisible,
  onClose,
  presets,
  onSelectPreset,
  onAddPreset,
  onDeletePreset,
}: PresetsBottomSheetProps) {
  const translateY = useSharedValue(0);
  const context = useSharedValue({ y: 0 });

  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newHours, setNewHours] = useState('0');
  const [newMinutes, setNewMinutes] = useState('20');

  const scrollTo = useCallback(
    (destination: number) => {
      'worklet';
      translateY.value = withTiming(destination, { duration: 300 });
    },
    [translateY]
  );

  React.useEffect(() => {
    if (isVisible) {
      scrollTo(-SCREEN_HEIGHT * 0.7);
    } else {
      scrollTo(0);
      setIsAdding(false);
    }
  }, [isVisible, scrollTo]);

  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateY.value };
    })
    .onUpdate((event) => {
      translateY.value = event.translationY + context.value.y;
      translateY.value = Math.max(translateY.value, MAX_TRANSLATE_Y);
    })
    .onEnd(() => {
      if (translateY.value > -SCREEN_HEIGHT / 3) {
        onClose();
      } else if (translateY.value < -SCREEN_HEIGHT / 1.5) {
        scrollTo(MAX_TRANSLATE_Y);
      } else {
        scrollTo(-SCREEN_HEIGHT * 0.7);
      }
    });

  const rBottomSheetStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const rBackdropStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isVisible ? 1 : 0),
    };
  }, [isVisible]);

  const handleAdd = () => {
    if (!newTitle) return;
    onAddPreset({
      title: newTitle,
      hours: parseInt(newHours) || 0,
      minutes: parseInt(newMinutes) || 0,
      icon: 'star-outline',
    });
    setNewTitle('');
    setIsAdding(false);
  };

  return (
    <>
      <Animated.View
        pointerEvents={isVisible ? 'auto' : 'none'}
        className="absolute inset-0 z-[90]"
        style={rBackdropStyle}>
        <Pressable onPress={onClose} className="absolute inset-0">
          <BlurView tint="dark" intensity={100} className="absolute inset-0" />
        </Pressable>
      </Animated.View>

      <GestureDetector gesture={gesture}>
        <Animated.View
          className="absolute z-[100] w-full rounded-tl-[32px] rounded-tr-[32px] border-l border-r border-t border-white/10 bg-[#111]"
          style={[{ height: SCREEN_HEIGHT, top: SCREEN_HEIGHT }, rBottomSheetStyle]}>
          <View className="my-[15px] h-1 w-10 self-center rounded-sm bg-white/20" />

          <View className="flex-1 px-6 pb-10">
            <View className="mb-6 flex-row items-center justify-between">
              <Text className="font-outfit text-2xl font-bold text-white">
                {isAdding ? 'New Preset' : 'Presets'}
              </Text>
              <TouchableOpacity
                onPress={() => setIsAdding(!isAdding)}
                className="h-10 w-10 items-center justify-center rounded-full bg-white/10"
                hitSlop={50}>
                <MaterialCommunityIcons
                  name={isAdding ? 'close' : 'plus'}
                  size={24}
                  color="white"
                />
              </TouchableOpacity>
            </View>

            {isAdding ? (
              <View className="flex-col gap-6">
                <View>
                  <Text className="mb-2 font-outfit text-xs font-bold uppercase tracking-widest text-gray-500">
                    TITLE
                  </Text>
                  <TextInput
                    value={newTitle}
                    onChangeText={setNewTitle}
                    placeholder="E.g., Meditation"
                    placeholderTextColor="#4b5563"
                    className="rounded-xl bg-white/5 p-4 font-outfit text-white"
                  />
                </View>

                <View className="flex-row gap-4">
                  <View className="flex-1">
                    <Text className="mb-2 font-outfit text-xs font-bold uppercase tracking-widest text-gray-500">
                      HOURS
                    </Text>
                    <TextInput
                      value={newHours}
                      onChangeText={setNewHours}
                      keyboardType="numeric"
                      className="rounded-xl bg-white/5 p-4 font-outfit text-white"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="mb-2 font-outfit text-xs font-bold uppercase tracking-widest text-gray-500">
                      MINS
                    </Text>
                    <TextInput
                      value={newMinutes}
                      onChangeText={setNewMinutes}
                      keyboardType="numeric"
                      className="rounded-xl bg-white/5 p-4 font-outfit text-white"
                    />
                  </View>
                </View>

                <TouchableOpacity
                  onPress={handleAdd}
                  disabled={!newTitle}
                  className={`mt-4 items-center rounded-xl py-4 ${newTitle ? 'bg-indigo-600' : 'bg-[#23262b]'}`}>
                  <Text className="font-outfit font-bold text-white">Save Preset</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <ScrollView showsVerticalScrollIndicator={false}>
                {presets.map((preset) => (
                  <View key={preset.id} className="mb-4 flex-row items-center">
                    <TouchableOpacity
                      onPress={() => {
                        onSelectPreset(preset);
                        onClose();
                      }}
                      className="flex-1 flex-row items-center gap-2 rounded-full border border-white/5 bg-surface p-4 shadow-md">
                      <View className="mr-4 h-12 w-12 items-center justify-center rounded-xl">
                        <MaterialCommunityIcons
                          name={preset.icon as any}
                          size={24}
                          color="#9ca3af"
                        />
                      </View>
                      <View className="flex-1">
                        <Text className="font-outfit text-lg font-bold text-white">
                          {preset.title}
                        </Text>
                        <Text className="font-outfit text-sm text-gray-400">
                          {preset.hours > 0 ? `${preset.hours}h ` : ''}
                          {preset.minutes}m
                        </Text>
                      </View>
                    </TouchableOpacity>

                    {preset.isCustom && (
                      <TouchableOpacity
                        onPress={() => onDeletePreset(preset.id)}
                        className="ml-2 h-10 w-10 items-center justify-center"
                        hitSlop={50}>
                        <MaterialCommunityIcons
                          name="trash-can-outline"
                          size={24}
                          color="#ef4444"
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
        </Animated.View>
      </GestureDetector>
    </>
  );
}
