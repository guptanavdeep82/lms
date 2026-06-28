importScripts("https://www.gstatic.com/firebasejs/11.10.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/11.10.0/firebase-messaging-compat.js");

var fcmMessaging = null;

function parsePayload(event) {
  if (!event || !event.data) {
    return {};
  }

  try {
    return event.data.json();
  } catch (error) {
    try {
      return JSON.parse(event.data.text());
    } catch (innerError) {
      return { data: { message: event.data.text() || "" } };
    }
  }
}

function buildNotificationParts(payload) {
  var title = (payload.notification && payload.notification.title) || (payload.data && payload.data.title) || "KR Logics";
  var body = (payload.notification && payload.notification.body) || (payload.data && payload.data.message) || "";
  var clickUrl =
    (payload.data && payload.data.click_url) ||
    (payload.fcmOptions && payload.fcmOptions.link) ||
    self.location.origin + "/";

  return {
    title: title,
    options: {
      body: body,
      icon: self.location.origin + "/kr-logics-logo.png",
      image: (payload.notification && payload.notification.image) || (payload.data && payload.data.image_url),
      data: { click_url: clickUrl },
      requireInteraction: false,
    },
  };
}

function showPushNotification(payload) {
  var parts = buildNotificationParts(payload);
  return self.registration.showNotification(parts.title, parts.options);
}

function setupFirebase(config) {
  if (!config || !config.projectId || fcmMessaging) {
    return;
  }

  try {
    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    }

    fcmMessaging = firebase.messaging();
    fcmMessaging.onBackgroundMessage(function (payload) {
      return showPushNotification(payload);
    });
  } catch (error) {
    console.error("[FCM SW] Firebase init failed", error);
  }
}

function loadConfigFromApi() {
  return fetch(self.location.origin + "/api/firebase/config", { cache: "no-store" })
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Config request failed");
      }
      return response.json();
    })
    .then(setupFirebase)
    .catch(function (error) {
      console.error("[FCM SW] Config load failed", error);
    });
}

try {
  importScripts(self.location.origin + "/api/firebase/sw-config");
  if (self.firebaseConfig) {
    setupFirebase(self.firebaseConfig);
  }
} catch (error) {
  console.error("[FCM SW] importScripts config failed", error);
}

self.addEventListener("message", function (event) {
  if (event.data && event.data.type === "FCM_INIT" && event.data.config) {
    setupFirebase(event.data.config);
  }
});

self.addEventListener("install", function () {
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    Promise.all([self.clients.claim(), loadConfigFromApi()]),
  );
});

// Native push handler — works even if Firebase SDK init fails in SW.
self.addEventListener("push", function (event) {
  var payload = parsePayload(event);
  event.waitUntil(showPushNotification(payload));
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  var targetUrl = (event.notification.data && event.notification.data.click_url) || self.location.origin + "/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (clientList) {
      for (var i = 0; i < clientList.length; i++) {
        var client = clientList[i];
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
