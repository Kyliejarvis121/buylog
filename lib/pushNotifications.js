import { PushNotifications } from "@capacitor/push-notifications";

export async function initPushNotifications() {
  const permission = await PushNotifications.requestPermissions();

  if (permission.receive === "granted") {
    await PushNotifications.register();
  }

  PushNotifications.addListener("registration", (token) => {
    console.log("Push Token:", token.value);
  });

  PushNotifications.addListener("pushNotificationReceived", (notification) => {
    console.log("Notification:", notification);
  });
}