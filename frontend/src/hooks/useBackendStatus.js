import { useState, useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';
import { wakeUpBackend as wakeUpBackendAPI } from '../services/apiService';

const WAKE_UP_INTERVAL = 10000; // 10 seconds

export const useBackendStatus = () => {
    const [backendStatus, setBackendStatus] = useState('unknown');
    const [shouldRetry, setShouldRetry] = useState(true);

    const wakeUpBackend = useCallback(async () => {
        if (backendStatus === 'ready') {
            setShouldRetry(false);
            return;
        }

        setBackendStatus('waking');
        toast.info('Attempting to connect to the backend server...', {
            toastId: 'wakeup-info',
        });

        try {
            await wakeUpBackendAPI();
            setBackendStatus('ready');
            setShouldRetry(false);
            toast.dismiss('wakeup-error');
            toast.dismiss('wakeup-retry-info');
            toast.success('Backend server is ready!', {
                toastId: 'wakeup-success',
            });
        } catch (error) {
            console.error('Wake-up error:', error);
            setBackendStatus('error');
            toast.error('Failed to connect to the backend server', {
                toastId: 'wakeup-error',
            });
            toast.info(
                'Automatic retry will be attempted in a few seconds. Please refresh the page and try again later.',
                { toastId: 'wakeup-retry-info', autoClose: WAKE_UP_INTERVAL }
            );
        }
    }, [backendStatus]);

    useEffect(() => {
        let timeoutId = null;

        const attemptWakeUp = () => {
            wakeUpBackend();
            if (shouldRetry) {
                timeoutId = setTimeout(() => {
                    if (shouldRetry) {
                        attemptWakeUp();
                    }
                }, WAKE_UP_INTERVAL);
            }
        };

        if (shouldRetry) {
            attemptWakeUp();
        }

        return () => {
            clearTimeout(timeoutId);
        };
    }, [shouldRetry, wakeUpBackend]);

    return { backendStatus, wakeUpBackend };
};
