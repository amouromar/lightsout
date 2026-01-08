import React, { useState } from 'react';
import { View, Text, TouchableOpacity, LayoutChangeEvent, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Canvas, Box, BoxShadow, rect, rrect } from '@shopify/react-native-skia';
import { useVideoPlayer, VideoView } from 'expo-video';
import { SessionMode, MODES_CONFIG } from '../constants/modes';

interface ModeSelectorProps {
  selectedMode: SessionMode;
  onModeChange: (mode: SessionMode) => void;
}

interface ModeItemProps {
  label: SessionMode;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  isSelected: boolean;
  onPress: () => void;
  onLayout: (event: LayoutChangeEvent) => void;
  dims?: { width: number; height: number };
  videoSource: any;
}

const ModeItem: React.FC<ModeItemProps> = ({
  label,
  icon,
  isSelected,
  onPress,
  onLayout,
  dims,
  videoSource,
}) => {
  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = true;
    player.muted = true;
    player.play();
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      onLayout={onLayout}
      activeOpacity={0.8}
      className={`relative flex-1 items-center justify-center overflow-hidden rounded-3xl border py-4 ${
        isSelected ? 'border-white/20' : 'border-white/5'
      }`}>
      {/* Video Background */}
      <VideoView
        player={player}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        nativeControls={false}
      />

      {/* Dark Overlay */}
      <View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: isSelected ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.6)' },
        ]}
      />

      {isSelected && dims && (
        <View style={StyleSheet.absoluteFill}>
          <Canvas style={{ flex: 1 }}>
            <Box box={rrect(rect(0, 0, dims.width, dims.height), 24, 24)} color="transparent">
              <BoxShadow dx={0} dy={4} blur={10} color="rgba(0,0,0,0.8)" inner />
              <BoxShadow dx={0} dy={-1} blur={4} color="rgba(255,255,255,0.1)" inner />
            </Box>
          </Canvas>
        </View>
      )}

      <MaterialCommunityIcons
        name={icon}
        size={32}
        color={isSelected ? 'white' : '#9ca3af'}
        style={{ zIndex: 1 }}
      />
      <Text
        className={`mt-2 font-outfit text-base ${
          isSelected ? 'font-bold text-white' : 'text-gray-400'
        }`}
        style={{ zIndex: 1 }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export const ModeSelector: React.FC<ModeSelectorProps> = ({ selectedMode, onModeChange }) => {
  const [dims, setDims] = useState<Record<string, { width: number; height: number }>>({});

  const onLayout = (label: string) => (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setDims((prev) => ({ ...prev, [label]: { width, height } }));
  };

  return (
    <View className="flex-row justify-between gap-4 px-4 py-4">
      {MODES_CONFIG.map((mode) => (
        <ModeItem
          key={mode.label}
          label={mode.label}
          icon={mode.icon}
          isSelected={selectedMode === mode.label}
          onPress={() => onModeChange(mode.label)}
          onLayout={onLayout(mode.label)}
          dims={dims[mode.label]}
          videoSource={mode.video}
        />
      ))}
    </View>
  );
};
export { SessionMode };

