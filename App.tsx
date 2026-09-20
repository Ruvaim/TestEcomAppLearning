import React, { useEffect } from 'react';
import { Alert, AppState, Platform, StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { store, persistor } from './src/store/store';
import RootNavigator from './src/navigation/RootNavigator';
import {
  checkExactAlarmPermission,
  openExactAlarmSettings,
  scheduleAppIconChange,
} from './src/services/appIconScheduler.android';

import { initializeIOSAppIconScheduler } from './src/services/appIconScheduler.ios';

const App = () => {
  useEffect(() => {
    if (Platform.OS === 'android') {
      let settingsOpened = false;

      const setupAndroidAppIconSchedule = async () => {
        const hasPermission = await checkExactAlarmPermission();

        if (hasPermission) {
          await scheduleAppIconChange();
          return;
        }

        Alert.alert(
          'Enable Automatic App Icon',
          'To automatically change the app icon during promotional periods, EcommerceApp needs permission to schedule exact alarms.',
          [
            {
              text: 'Not Now',
              style: 'cancel',
            },
            {
              text: 'Allow',
              onPress: async () => {
                settingsOpened = true;
                await openExactAlarmSettings();
              },
            },
          ],
        );
      };

      setupAndroidAppIconSchedule();

      const subscription = AppState.addEventListener(
        'change',
        async nextState => {
          if (nextState === 'active' && settingsOpened) {
            settingsOpened = false;

            const hasPermission = await checkExactAlarmPermission();

            if (hasPermission) {
              await scheduleAppIconChange();
            }
          }
        },
      );

      return () => {
        subscription.remove();
      };
    }

    return undefined;
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'ios') {
      return;
    }

    const cleanup = initializeIOSAppIconScheduler();

    return cleanup;
  }, []);
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <StatusBar barStyle="dark-content" />

          <RootNavigator />
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
