import { AppState, NativeModules } from 'react-native';

const { AppIconManager } = NativeModules;

export type AppIconSchedule = {
  startDateTime: string;
  endDateTime: string;
  promotionalIcon: string;
};

export const APP_ICON_SCHEDULE: AppIconSchedule = {
  startDateTime: '2026-09-20T14:48:00+05:30',
  endDateTime: '2026-09-20T14:49:00+05:30',
  promotionalIcon: 'PromotionalIcon',
};

let currentIcon: string | null | undefined;

const getRequiredIcon = (schedule: AppIconSchedule) => {
  const now = new Date();

  const start = new Date(schedule.startDateTime);
  const end = new Date(schedule.endDateTime);

  if (now >= start && now <= end) {
    return schedule.promotionalIcon;
  }

  return null;
};

export const initializeIOSAppIconScheduler = (
  schedule: AppIconSchedule = APP_ICON_SCHEDULE,
) => {
  const updateIcon = async () => {
    if (!AppIconManager) {
      console.warn('❌ AppIconManager is unavailable');
      return;
    }

    const requiredIcon = getRequiredIcon(schedule);

    if (currentIcon === requiredIcon) {
      return;
    }

    try {
      await AppIconManager.setIcon(requiredIcon);

      currentIcon = requiredIcon;

      console.log('✅ iOS icon changed:', requiredIcon ?? 'DefaultIcon');
    } catch (error) {
      console.error('❌ Failed to change iOS icon:', error);
    }
  };

  updateIcon();

  const interval = setInterval(updateIcon, 30_000);

  const subscription = AppState.addEventListener('change', nextState => {
    if (nextState === 'active') {
      updateIcon();
    }
  });

  return () => {
    clearInterval(interval);
    subscription.remove();
  };
};
