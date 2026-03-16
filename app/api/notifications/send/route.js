import admin from "firebase-admin";

await admin.messaging().send({
  token: user.deviceToken,
  notification: {
    title: "New Order",
    body: "You received a new order",
  },
});