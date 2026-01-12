/* eslint-disable @typescript-eslint/no-require-imports */
import { useEffect, useState, useCallback } from 'react';
import { Platform } from 'react-native';
import * as Brightness from 'expo-brightness';
import Constants from 'expo-constants';

const isExpoGo = Constants.appOwnership === 'expo';
const isAndroid = Platform.OS === 'android';

// Conditionally require native modules
const Notifications = !isExpoGo || !isAndroid ? require('expo-notifications') : null;

// Configure notifications only if not in Expo Go or if it's iOS
if (!isExpoGo || Platform.OS === 'ios') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

// Shared state across all useDeviceAPI instances
let sharedOriginalBrightness: number | null = null;

export const useDeviceAPI = () => {
  const [hasBrightnessPermission, setHasBrightnessPermission] = useState(false);
  const [hasNotificationPermission, setHasNotificationPermission] = useState(false);
  const [, setForceUpdate] = useState(0); // Used to trigger re-render when shared state changes

  useEffect(() => {
    (async () => {
      // Request Brightness permissions
      const { status: brightnessStatus } = await Brightness.requestPermissionsAsync();
      setHasBrightnessPermission(brightnessStatus === 'granted');

      // Request Notification permissions
      if (Notifications) {
        const { status: notificationStatus } = await Notifications.requestPermissionsAsync();
        setHasNotificationPermission(notificationStatus === 'granted');
      }
    })();
  }, []);

  const setAppBrightness = useCallback(
    async (level: number) => {
      if (!hasBrightnessPermission) return;
      try {
        const current = await Brightness.getBrightnessAsync();
        if (sharedOriginalBrightness === null) {
          sharedOriginalBrightness = current;
          setForceUpdate((v) => v + 1);
        }
        await Brightness.setBrightnessAsync(level);
      } catch (e) {
        console.error('Error setting brightness:', e);
      }
    },
    [hasBrightnessPermission]
  );

  const restoreBrightness = useCallback(async () => {
    if (!hasBrightnessPermission || sharedOriginalBrightness === null) return;
    try {
      await Brightness.setBrightnessAsync(sharedOriginalBrightness);
    } catch (e) {
      console.error('Error restoring brightness:', e);
    }
  }, [hasBrightnessPermission]);

  const updateLockscreenCountdown = useCallback(
    async (remainingSeconds: number) => {
      if (!hasNotificationPermission || !Notifications) return;

      const minutes = Math.floor(remainingSeconds / 60);
      const seconds = remainingSeconds % 60;
      const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;

      try {
        await Notifications.setNotificationChannelAsync('countdown', {
          name: 'Timer Countdown',
          importance: Notifications.AndroidImportance.HIGH,
          lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
          sound: null,
        });

        await Notifications.scheduleNotificationAsync({
          identifier: 'timer-countdown',
          content: {
            title: 'Lights Out!',
            body: `Currently LightsOut! ${timeString} remaining`,
            sticky: true,
            autoDismiss: false,
            data: { remainingSeconds },
          },
          trigger: null,
        });
      } catch (e) {
        console.error('Error updating notification:', e);
      }
    },
    [hasNotificationPermission]
  );

  const clearNotification = useCallback(async () => {
    if (Notifications) {
      await Notifications.dismissAllNotificationsAsync();
    }
  }, []);

  return {
    setAppBrightness,
    restoreBrightness,
    updateLockscreenCountdown,
    clearNotification,
    hasPermissions: hasBrightnessPermission && hasNotificationPermission,
  };
};
