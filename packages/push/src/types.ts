// Shape stored per push subscription (matches the browser PushSubscription JSON
// and the PushSubscriptions Payload collection).
export interface WebPushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

// Payload delivered to the service worker `push` event.
export interface PushNotificationPayload {
  title: string;
  body: string;
  url?: string;
  icon?: string;
  tag?: string;
}
