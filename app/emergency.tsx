import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Button, Linking, Platform, StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import * as Location from 'expo-location';
import { sendEmergencyAlert, getEmergencyHistory } from '@/scripts/emergencyapi';
import { getFromStorage } from '@/scripts/db';

export default function EmergencyScreen() {
    const [isSending, setIsSending] = useState(false);
    const [history, setHistory] = useState<any[]>([]);

    const loadHistory = useCallback(async (userId: number) => {
        try {
            const items = await getEmergencyHistory(userId);
            setHistory(Array.isArray(items) ? items : []);
        } catch (e) {
            // Already alerted inside API layer
        }
    }, []);

    const requestLocationAsync = useCallback(async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            return null;
        }
        const location = await Location.getCurrentPositionAsync({});
        return {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
        };
    }, []);

    const handleCallEmergency = useCallback(async () => {
        const phone = '112';
        const url = Platform.select({ ios: `telprompt:${phone}`, default: `tel:${phone}` }) as string;
        const supported = await Linking.canOpenURL(url);
        if (supported) {
            await Linking.openURL(url);
        } else {
            Alert.alert('Calling not supported on this device');
        }
    }, []);

    const handleSendAlert = useCallback(async () => {
        setIsSending(true);
        try {
            const userData = await getFromStorage<any>('user');
            const userId = userData?.user?.userId ?? userData?.user?.id ?? 1;

            const location = await requestLocationAsync();
            const response = await sendEmergencyAlert({
                userId,
                message: 'Emergency alert triggered from mobile app',
                location: location ?? undefined,
            });
            Alert.alert('Sent', 'Your emergency alert has been sent.');
            await loadHistory(userId);
        } catch (e) {
            // Alert already shown by API layer
        } finally {
            setIsSending(false);
        }
    }, [loadHistory, requestLocationAsync]);

    useEffect(() => {
        (async () => {
            const userData = await getFromStorage<any>('user');
            const userId = userData?.user?.userId ?? userData?.user?.id ?? 1;
            await loadHistory(userId);
        })();
    }, [loadHistory]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Emergency</Text>
            <Button title={isSending ? 'Sending...' : 'Send Alert'} onPress={handleSendAlert} disabled={isSending} />
            <View style={styles.spacer} />
            <Button title="Call 112" onPress={handleCallEmergency} color="red" />

            {history.length > 0 && (
                <View style={styles.historyContainer}>
                    <Text style={styles.historyTitle}>Recent Alerts</Text>
                    {history.slice(0, 5).map((item, idx) => (
                        <Text key={idx} style={styles.historyItem}>
                            {item?.timestamp ?? item?.createdAt ?? '—'} — {item?.status ?? 'sent'}
                        </Text>
                    ))}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    spacer: {
        height: 16,
    },
    historyContainer: {
        marginTop: 24,
    },
    historyTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    historyItem: {
        fontSize: 14,
        marginBottom: 4,
    },
});