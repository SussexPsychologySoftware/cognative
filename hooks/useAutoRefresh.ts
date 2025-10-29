import { useCallback, useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { useFocusEffect } from 'expo-router';

interface AutoRefreshOptions {
    onRefresh: () => Promise<void> | void;

    /** Refresh when screen comes into focus (default: true) */
    refreshOnFocus?: boolean;

    /** Refresh when app becomes active/foregrounds (default: true) */
    refreshOnAppActive?: boolean;

    /** Hour of day (0-23) to schedule automatic refresh (default: undefined - no scheduled refresh) */
    scheduledRefreshHour?: number;

    /** Minute of hour (0-59) for scheduled refresh (default: 0) */
    scheduledRefreshMinute?: number;

    /** Refresh on initial mount (default: true) */
    refreshOnMount?: boolean;

    /** Enable manual refresh capability (default: true) */
    enableManualRefresh?: boolean;
}

interface AutoRefreshReturn {
    /** Whether currently refreshing */
    refreshing: boolean;

    /** Manually trigger a refresh */
    refresh: () => Promise<void>;

    /** Whether initial load is complete */
    loading: boolean;
}

/**
 * Hook to automatically keep data fresh with multiple refresh triggers
 *
 * @example
 * ```tsx
 * const { refreshing, refresh, loading } = useAutoRefresh({
 *   onRefresh: loadData,
 *   scheduledRefreshHour: 4, // Refresh at 4 AM
 * });
 *
 * return (
 *   <ScrollView refreshControl={
 *     <RefreshControl refreshing={refreshing} onRefresh={refresh} />
 *   }>
 *     {loading ? <Spinner /> : <YourContent />}
 *   </ScrollView>
 * );
 * ```
 */
export function useAutoRefresh(options: AutoRefreshOptions): AutoRefreshReturn {
    const {
        onRefresh,
        refreshOnFocus = true,
        refreshOnAppActive = true,
        scheduledRefreshHour,
        scheduledRefreshMinute = 0,
        refreshOnMount = true,
        enableManualRefresh = true,
    } = options;

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [timerId, setTimerId] = useState(0); // Just a dummy number to re-run the effect

    // Core refresh function
    const executeRefresh = useCallback(
        async (isInitialLoad = false) => {
            if (isInitialLoad) {
                setLoading(true);
            } else {
                setRefreshing(true);
            }

            try {
                await onRefresh();
            } catch (error) {
                console.error('Error during refresh:', error);
                throw error;
            } finally {
                if (isInitialLoad) {
                    setLoading(false);
                } else {
                    setRefreshing(false);
                }
            }
        },
        [onRefresh]
    );

    // Initial mount refresh
    useEffect(() => {
        if (refreshOnMount) {
            void executeRefresh(true);
        } else {
            setLoading(false);
        }
    }, [refreshOnMount, executeRefresh]);

    // Focus refresh
    useFocusEffect(
        useCallback(() => {
            if (refreshOnFocus && !loading) {
                void executeRefresh();
            }
        }, [refreshOnFocus, executeRefresh, loading])
    );

    // App state (foreground/background) refresh
    useEffect(() => {
        if (!refreshOnAppActive) return;

        const handleAppStateChange = async (nextAppState: string) => {
            if (nextAppState === 'active') {
                await executeRefresh();
            }
        };

        const subscription = AppState.addEventListener('change', handleAppStateChange);
        return () => subscription.remove();
    }, [refreshOnAppActive, executeRefresh]);

    // Scheduled refresh at specific time
    useEffect(() => {
        if (scheduledRefreshHour === undefined) return;

        const getMillisecondsUntilScheduledTime = () => {
            const now = new Date();
            const scheduledTime = new Date();

            scheduledTime.setHours(scheduledRefreshHour, scheduledRefreshMinute, 0, 0);

            // If scheduled time has passed today, set to tomorrow
            if (now >= scheduledTime) {
                scheduledTime.setDate(scheduledTime.getDate() + 1);
            }

            return scheduledTime.getTime() - now.getTime();
        };

        const msUntilScheduledTime = getMillisecondsUntilScheduledTime();
        const timeoutId = setTimeout(async () => {
            console.log(`Scheduled refresh triggered at ${scheduledRefreshHour}:${scheduledRefreshMinute}`);
            await executeRefresh();
            // RE-TRIGGER THE EFFECT TO SET THE *NEXT* TIMER
            setTimerId(id => id + 1);
        }, msUntilScheduledTime);

        return () => clearTimeout(timeoutId);
    }, [scheduledRefreshHour, scheduledRefreshMinute, executeRefresh, timerId]);

    // Manual refresh function
    const manualRefresh = useCallback(async () => {
        if (!enableManualRefresh) return;
        await executeRefresh();
    }, [enableManualRefresh, executeRefresh]);

    return {
        refreshing,
        refresh: manualRefresh,
        loading,
    };
}

// Optional: More specific hook for common use case
export function useDataSync<T>(
    fetchData: () => Promise<T>,
    options?: Omit<AutoRefreshOptions, 'onRefresh'>
) {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<Error | null>(null);

    const loadData = useCallback(async () => {
        try {
            setError(null);
            const result = await fetchData();
            setData(result);
        } catch (err) {
            setError(err instanceof Error ? err : new Error(String(err)));
            throw err;
        }
    }, [fetchData]);

    const { refreshing, refresh, loading } = useAutoRefresh({
        onRefresh: loadData,
        ...options,
    });

    return {
        data,
        error,
        loading,
        refreshing,
        refresh,
    };
}
