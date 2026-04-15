self.addEventListener('push', (event) => {
  console.log('🔔 Push event received!', new Date().toISOString());
  
  if (!event.data){
    console.error('❌ No event.data - push notification is empty');
    return;
  }

  try {
    const payload = event.data.json();
    console.log('📦 Payload:', payload);
    
    const { title, body, data } = payload;

    event.waitUntil(
      self.registration.showNotification(title, {
        body,
        icon: '/logo.png',
        badge: '/logo.png',
        data,
        requireInteraction: false,
      }).then(() => {
        console.log('✅ Notification displayed successfully');
      }).catch((err) => {
        console.error('❌ Failed to show notification:', err);
      })
    );
  } catch (err) {
    console.error('❌ Error parsing push data:', err);
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const url = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Focus existing tab if open
      for (const client of windowClients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(url);
          return client.focus();
          
        }
      }
      // Otherwise open new tab
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
