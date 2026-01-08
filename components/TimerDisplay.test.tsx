import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { TimerDisplay } from './TimerDisplay';

describe('TimerDisplay', () => {
  it('renders correct hours and minutes', () => {
    const { getByText } = render(<TimerDisplay hours={1} minutes={25} />);
    expect(getByText('01')).toBeTruthy();
    expect(getByText('25')).toBeTruthy();
    expect(getByText('HOURS')).toBeTruthy();
    expect(getByText('MINUTES')).toBeTruthy();
  });

  it('calls increment/decrement handlers', () => {
    const onIncrementHour = jest.fn();
    const onDecrementMinute = jest.fn();

    const { getByTestId } = render(
      <TimerDisplay
        hours={0}
        minutes={0}
        onIncrementHour={onIncrementHour}
        onDecrementMinute={onDecrementMinute}
      />
    );

    fireEvent(getByTestId('hour-increment'), 'pressIn');
    expect(onIncrementHour).toHaveBeenCalled();

    fireEvent(getByTestId('minute-decrement'), 'pressIn');
    expect(onDecrementMinute).toHaveBeenCalled();
  });
});
