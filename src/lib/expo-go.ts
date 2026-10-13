import Constants, { ExecutionEnvironment } from 'expo-constants';

/** True inside the Expo Go app, which lacks native modules that are only in our own builds (e.g. MapLibre). */
export const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
