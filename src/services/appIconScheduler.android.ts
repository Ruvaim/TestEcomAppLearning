import { NativeModules, Platform } from 'react-native';

const { AppIconManager } = NativeModules;

export const openExactAlarmSettings = async () => {
  if (Platform.OS !== 'android') {
    return;
  }

  try {
    await AppIconManager.openExactAlarmSettings();
  } catch (error) {
    console.error('❌ Failed to open exact alarm settings:', error);
  }
};

export const checkExactAlarmPermission = async () => {
  if (Platform.OS !== 'android') {
    return true;
  }

  try {
    return await AppIconManager.canScheduleExactAlarms();
  } catch (error) {
    console.error('❌ Failed to check exact alarm permission:', error);

    return false;
  }
};

export const scheduleAppIconChange = async () => {
  const startTime = new Date('2026-09-20T12:51:00+05:30').getTime();

  const endTime = new Date('2026-09-20T12:52:00+05:30').getTime();

  try {
    await AppIconManager.scheduleIconChange(startTime, endTime);

    console.log('✅ App icon schedule registered');
  } catch (error) {
    console.error('❌ Failed to schedule app icon change:', error);
  }
};
