import { useRef, useCallback } from 'react';

/**
 * A hook that provides props for a component to handle both single taps and long presses.
 * When long pressed, it triggers a repetitive action.
 *
 * @param action - The function to call on tap and repeatedly on long press
 * @param delay - The delay before starting the repetitive action (ms)
 * @param interval - The interval between repetitive actions (ms)
 */
export const useLongPress = (
  action: (() => void) | undefined,
  delay: number = 500,
  interval: number = 100
) => {
  const timerRef = useRef<any>(null);
  const actionRef = useRef<(() => void) | undefined>(action);

  // Keep actionRef up to date to avoid closure issues
  actionRef.current = action;

  const startRepetitiveAction = useCallback(() => {
    if (!actionRef.current) return;

    // Initial call
    actionRef.current();

    const runAction = () => {
      if (actionRef.current) {
        actionRef.current();
        timerRef.current = setTimeout(runAction, interval);
      }
    };

    timerRef.current = setTimeout(runAction, delay);
  }, [delay, interval]);

  const stopRepetitiveAction = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  return {
    onPressIn: startRepetitiveAction,
    onPressOut: stopRepetitiveAction,
  };
};
