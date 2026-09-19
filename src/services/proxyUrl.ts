import Constants from 'expo-constants';
import { Platform } from 'react-native';

const PROXY_PORT = 8787;

/**
 * Where the app should reach the local SerpAPI proxy.
 *
 * Web runs on the same host as the dev server, so localhost works. A phone in
 * Expo Go cannot resolve localhost, so the LAN host of the Expo dev server is
 * reused with the proxy port.
 */
export function resolveProxyBaseUrl(): string {
  const configured = process.env.EXPO_PUBLIC_API_PROXY_URL;
  if (configured) {
    return configured.replace(/\/$/, '');
  }

  if (Platform.OS !== 'web') {
    const hostUri = Constants.expoConfig?.hostUri ?? Constants.expoGoConfig?.debuggerHost;
    const host = hostUri?.split(':')[0];
    if (host) {
      return `http://${host}:${PROXY_PORT}/api`;
    }
  }

  return `http://localhost:${PROXY_PORT}/api`;
}
