import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useVideoPlayer, VideoView } from 'expo-video';
import { MODES_CONFIG, SessionMode, ModeConfig } from '@/constants/modes';

export { SessionMode };

interface ModeSelectorProps {
  selectedMode: SessionMode;
  onModeChange: (mode: SessionMode) => void;
}

const ModeItem = memo(
  ({
    mode,
    isSelected,
    onPress,
  }: {
    mode: ModeConfig;
    isSelected: boolean;
    onPress: () => void;
  }) => {
    const [status, setStatus] = React.useState<string>('idle');
    const [error, setError] = React.useState<string | null>(null);

    const player = useVideoPlayer(mode.video, (player) => {
      player.loop = true;
      player.muted = true;
      // Don't auto-play on creation to save bandwidth for unselected items
    });

    React.useEffect(() => {
      // Play if selected, pause otherwise
      if (isSelected) {
        player.play();
      } else {
        player.pause();
      }
    }, [isSelected, player]);

    React.useEffect(() => {
      const statusSub = player.addListener('statusChange', (payload) => {
        setStatus(payload.status);
      });

      const errorSub = player.addListener('playToEnd', () => {
        // Not really an error, but helps debug life cycle
      });

      return () => {
        statusSub.remove();
        errorSub.remove();
      };
    }, [player]);

    const isVideoReady = status === 'readyToPlay';

    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.container}>
        <View
          style={[
            styles.inner,
            { borderColor: isSelected ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.05)' },
          ]}>
          {/* Background Video */}
          <VideoView
            player={player}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            nativeControls={false}
          />

          {/* Loading Placeholder */}
          {!isVideoReady && (
            <View
              style={[
                StyleSheet.absoluteFill,
                { backgroundColor: '#111', justifyContent: 'center', alignItems: 'center' },
              ]}>
              <MaterialCommunityIcons name={mode.icon} size={32} color="rgba(255,255,255,0.1)" />
            </View>
          )}

          {/* Overlays */}
          {isSelected ? (
            <>
              <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.4)' }]} />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.6)']}
                style={StyleSheet.absoluteFill}
              />
              <BlurView intensity={10} tint="dark" style={StyleSheet.absoluteFill} />
              <View style={styles.topHighlight} />
            </>
          ) : (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.7)' }]} />
          )}

          {/* Content */}
          <View style={styles.content}>
            <View
              style={[styles.iconContainer, isSelected ? styles.iconActive : styles.iconInactive]}>
              <MaterialCommunityIcons
                name={mode.icon}
                size={24}
                color={isSelected ? '#ffffff' : '#9ca3af'}
              />
            </View>
            <Text
              style={[
                styles.label,
                { color: isSelected ? '#ffffff' : '#9ca3af' },
                isSelected ? styles.labelActive : {},
              ]}>
              {mode.label.toUpperCase()}
            </Text>
          </View>

          {/* Selection Indicator Dot */}
          {isSelected && <View style={styles.dot} />}
        </View>
      </TouchableOpacity>
    );
  }
);

export const ModeSelector = memo(({ selectedMode, onModeChange }: ModeSelectorProps) => {
  return (
    <View style={styles.row}>
      {MODES_CONFIG.map((mode) => (
        <ModeItem
          key={mode.label}
          mode={mode}
          isSelected={selectedMode === mode.label}
          onPress={() => onModeChange(mode.label)}
        />
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  inner: {
    position: 'relative',
    height: 112, // h-28
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: 24, // rounded-3xl
    borderWidth: 1,
  },
  topHighlight: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  content: {
    zIndex: 10,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 8,
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12, // rounded-2xl
  },
  iconActive: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  iconInactive: {
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  label: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
  },
  labelActive: {
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  dot: {
    position: 'absolute',
    bottom: 8,
    height: 4,
    width: 4,
    borderRadius: 2,
    backgroundColor: '#818cf8', // indigo-400
  },
});
