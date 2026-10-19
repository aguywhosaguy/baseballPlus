import { refreshData, seedFromBundled, refreshIfStale } from "@/utils/data";

export default defineBackground(() => {
  const ALARM = 'refresh-data';
  const ONE_DAY_MINUTES = 60 * 24;

  browser.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === ALARM) refreshData();
  });

  browser.runtime.onInstalled.addListener(async () => {
    await seedFromBundled();
    await refreshData();
  });

  browser.runtime.onStartup.addListener(() => {
    refreshIfStale();
  });

  browser.alarms.get(ALARM).then((existing) => {
    if (!existing) {
      browser.alarms.create(ALARM, {
        periodInMinutes: ONE_DAY_MINUTES,
        delayInMinutes: 1,
      });
    }
  });
});
