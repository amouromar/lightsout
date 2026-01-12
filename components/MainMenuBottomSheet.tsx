import React, { memo, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Pressable, ScrollView } from 'react-native';
import { BlurView } from 'expo-blur';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
  LinearTransition,
} from 'react-native-reanimated';
import * as Linking from 'expo-linking';
import * as Haptics from 'expo-haptics';

interface MainMenuBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
}

export const MainMenuBottomSheet = memo(({ isVisible, onClose }: MainMenuBottomSheetProps) => {
  const [view, setView] = useState<'menu' | 'about' | 'privacy'>('menu');

  if (!isVisible) return null;

  const handleReportBug = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const email = 'support@example.com';
    const subject = 'LightsOut Bug Report';
    const body = 'Please describe the bug or feedback below:\n\n';
    Linking.openURL(
      `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    );
  };

  const menuItems = [
    {
      icon: 'bug-outline',
      label: 'Report a Bug',
      onPress: handleReportBug,
      color: '#f87171',
    },
    {
      icon: 'information-outline',
      label: 'About LightsOut',
      onPress: () => setView('about'),
      color: '#60a5fa',
    },
    {
      icon: 'shield-lock-outline',
      label: 'Privacy Policy',
      onPress: () => setView('privacy'),
      color: '#34d399',
    },
  ];

  const renderContent = () => {
    switch (view) {
      case 'about':
        return (
          <Animated.View
            entering={FadeIn.duration(400)}
            exiting={FadeOut.duration(300)}
            className="flex-1">
            <TouchableOpacity
              onPress={() => setView('menu')}
              className="-ml-2 mb-4 flex-row items-center"
              hitSlop={20}>
              <MaterialCommunityIcons name="chevron-left" size={24} color="#9ca3af" />
              <Text className="font-outfit text-sm text-gray-400">Back</Text>
            </TouchableOpacity>
            <View className="mb-6 items-center">
              <View className="mb-4 h-20 w-20 items-center justify-center rounded-3xl bg-[#6366f1] shadow-lg">
                <MaterialCommunityIcons name="brightness-4" size={40} color="white" />
              </View>
              <Text className="font-outfit-bold text-[28px] text-white">LightsOut</Text>
              <Text className="mt-1 font-outfit text-sm text-gray-500">Version 1.0.0</Text>
            </View>
            <Text className="mx-auto mb-6 w-9/12 text-center font-outfit text-base leading-6 text-gray-400">
              One tap to kill all distractions. Wrapping you in calm... as chaos fades. Drop in
              deep... and actually get shit done. Or finally rest. {'\n\n'}{' '}
              <Text className="font-outfit-bold text-lg">Lights out.</Text>
            </Text>
            <Text className="absolute bottom-0 left-0 right-0 text-center font-outfit text-sm text-gray-600">
              Developed by Amour Omar in 2026.
            </Text>
          </Animated.View>
        );
      case 'privacy':
        return (
          <Animated.View
            entering={FadeIn.duration(400)}
            exiting={FadeOut.duration(300)}
            className="flex-1">
            <TouchableOpacity
              onPress={() => setView('menu')}
              className="-ml-2 mb-4 flex-row items-center"
              hitSlop={20}>
              <MaterialCommunityIcons name="chevron-left" size={24} color="#9ca3af" />
              <Text className="font-outfit text-sm text-gray-400">Back</Text>
            </TouchableOpacity>
            <Text className="mb-6 font-outfit-bold text-xl text-white">Privacy Policy</Text>
            <ScrollView
              className="flex-1"
              contentContainerStyle={{ paddingBottom: 40 }}
              showsVerticalScrollIndicator={true}>
              <Text className="font-outfit text-sm leading-[22px] text-gray-400">
                Last Updated: January 2026
                {'\n\n'}
                <Text className="font-outfit-bold text-base text-white">1. Data Collection</Text>
                {'\n'}
                LightsOut does not collect or share any personal identity information. All your
                data, including presets and session settings, stays locally on your device.
                {'\n\n'}
                <Text className="font-outfit-bold text-base text-white">2. Location Data</Text>
                {'\n'}
                We request location access to provide real-time weather and time context during your
                focus sessions. This data is processed locally and is never transmitted to our
                servers or third parties.
                {'\n\n'}
                <Text className="font-outfit-bold text-base text-white">3. Permissions</Text>
                {'\n'}• <Text className="font-outfit-bold text-white">Brightness:</Text> Used only
                to dim your screen during active focus sessions.
                {'\n'}• <Text className="font-outfit-bold text-white">Notifications:</Text> Used to
                show your remaining focus time on the lock screen.
                {'\n\n'}
                <Text className="font-outfit-bold text-base text-white">
                  4. Third-Party Services
                </Text>
                {'\n'}
                LightsOut uses Expo and Supabase for core functionality (like video assets). These
                services do not receive your personal data or location from this app.
              </Text>
            </ScrollView>
          </Animated.View>
        );
      default:
        return (
          <Animated.View
            entering={FadeIn.duration(400)}
            exiting={FadeOut.duration(300)}
            className="gap-3">
            <Text className="mb-6 font-outfit-bold text-xl text-white">Main Menu</Text>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                className="flex-row items-center gap-4 rounded-[20px] bg-white/[0.03] p-4"
                onPress={item.onPress}
                activeOpacity={0.7}>
                <View
                  className="h-10 w-10 items-center justify-center rounded-xl"
                  style={{ backgroundColor: item.color + '20' }}>
                  <MaterialCommunityIcons name={item.icon as any} size={22} color={item.color} />
                </View>
                <Text className="flex-1 font-outfit text-base text-gray-300">{item.label}</Text>
                <MaterialCommunityIcons name="chevron-right" size={20} color="#374151" />
              </TouchableOpacity>
            ))}
          </Animated.View>
        );
    }
  };

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
          layout={LinearTransition}
          className="rounded-t-[32px] border border-white/5 bg-[#111] p-6 pb-10"
          style={view !== 'menu' ? { height: '80%' } : null}>
          <View className="mb-6 h-1 w-10 self-center rounded-full bg-white/10" />
          {renderContent()}
        </Animated.View>
      </View>
    </Modal>
  );
});
