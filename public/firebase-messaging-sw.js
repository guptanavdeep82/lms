importScripts("https://www.gstatic.com/firebasejs/11.10.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/11.10.0/firebase-messaging-compat.js");
importScripts("/api/firebase/sw-config");

if (self.firebaseConfig && self.firebaseConfig.projectId) {
  firebase.initializeApp(self.firebaseConfig);
  const messaging = firebase.messaging();

  messaging.onBackgroundMessage(function (payload) {
    const title = payload.notification?.title || payload.data?.title || "KR Logics";
    const body = payload.notification?.body || payload.data?.message || "";
    const clickUrl = payload.data?.click_url || payload.fcmOptions?.link || self.location.origin + "/";
    const options = {
      body,
      icon: payload.notification?.icon || "/kr-logics-logo.png",
      image: payload.notification?.image || payload.data?.image_url,
      data: { click_url: clickUrl },
    };

    return self.registration.showNotification(title, options);
  });
}

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  const targetUrl = event.notification.data?.click_url || "/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (clientList) {
      for (const client of clientList) {
        if ("focus" in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }

      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    }),
  );
});
