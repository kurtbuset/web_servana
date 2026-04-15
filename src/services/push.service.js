import api from '../api';

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;

/**
 * Convert a base64url string to a Uint8Array (required by pushManager.subscribe).
 */
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

/**
 * Register the service worker. Returns the ServiceWorkerRegistration or null.
 */
export async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return null;
  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    console.log('✅ Service worker registered');
    return registration;
  } catch (err) {
    console.error('❌ Service worker registration failed:', err);
    return null;
  }
}

/**
 * Subscribe to push notifications using the VAPID public key.
 * Returns the PushSubscription or null.
 */
export async function subscribeToPush(registration) {
  if (!VAPID_PUBLIC_KEY) {
    console.warn('⚠️ VITE_VAPID_PUBLIC_KEY not set — push notifications disabled');
    return null;
  }
  try {
    const existing = await registration.pushManager.getSubscription();
    if (existing) return existing;

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });
    console.log('✅ Push subscription created');
    return subscription;
  } catch (err) {
    console.error('❌ Push subscription failed:', err);
    return null;
  }
}

/**
 * Save the push subscription to the backend.
 */
export async function savePushSubscription(subscription) {
  await api.post('/push/subscribe', subscription.toJSON());
}

/**
 * Unsubscribe from push and remove from backend.
 */
export async function unsubscribePush() {
  if (!('serviceWorker' in navigator)) return;
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    if (!subscription) return;

    await api.delete('/push/subscribe', { data: { endpoint: subscription.endpoint } });
    await subscription.unsubscribe();
    console.log('✅ Push subscription removed');
  } catch (err) {
    console.error('❌ Failed to unsubscribe push:', err);
  }
}

/**
 * Full setup flow: register SW, request permission, subscribe, save.
 * Safe to call on every login — skips if already subscribed.
 */
export async function setupPushNotifications() {
  if (!('Notification' in window) || !('PushManager' in window)) return;

  const permission = Notification.permission === 'default'
    ? await Notification.requestPermission()
    : Notification.permission;

  if (permission !== 'granted') return;

  const registration = await registerServiceWorker();
  if (!registration) return;

  const subscription = await subscribeToPush(registration);
  console.log(JSON.stringify(subscription, null, 2))
  if (!subscription) return;

  await savePushSubscription(subscription);
}
