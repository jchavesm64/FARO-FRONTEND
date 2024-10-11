import { useState, useEffect, useCallback } from 'react';
import { getElapsedTime } from '../helpers/timeUtils';

export function useTimer(initialStartTime = null) {
    const [startTime, setStartTime] = useState(initialStartTime);
    const [elapsedTime, setElapsedTime] = useState('00:00');
    const [isRunning, setIsRunning] = useState(!!initialStartTime);

    const start = useCallback((time = new Date()) => {
        setStartTime(time);
        setIsRunning(true);
    }, []);

    const stop = useCallback(() => {
        setIsRunning(false);
    }, []);

    const reset = useCallback(() => {
        setStartTime(null);
        setElapsedTime('00:00');
        setIsRunning(false);
    }, []);

    useEffect(() => {
        let intervalId;
        if (isRunning && startTime) {
            intervalId = setInterval(() => {
                setElapsedTime(getElapsedTime(startTime));
            }, 1000);
        }
        return () => clearInterval(intervalId);
    }, [isRunning, startTime]);

    return { elapsedTime, start, stop, reset, isRunning };
}