import { renderHook } from '@testing-library/react-native';
import { act } from 'react-test-renderer';
import { useGameSession } from '../hooks/useGameSession';

describe('useGameSession', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('başlatıldığında süre sayar ve skor günceller', () => {
    const { result } = renderHook(() => useGameSession(5));

    act(() => {
      result.current.start();
    });

    act(() => {
      jest.advanceTimersByTime(2000);
      result.current.increment(50);
    });

    expect(result.current.elapsed).toBe(2);
    expect(result.current.score).toBe(50);
    expect(result.current.remaining).toBe(3);

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(result.current.status).toBe('finished');
  });
});
