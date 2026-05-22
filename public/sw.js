// MindPing Service Worker v2.0
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(clients.claim()));

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const q = e.notification.data;
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      if (list.length > 0) {
        list[0].focus();
        list[0].postMessage({ type: 'SHOW_QUESTION', data: q });
      } else {
        clients.openWindow(self.location.origin).then((c) => {
          if (c) setTimeout(() => c.postMessage({ type: 'SHOW_QUESTION', data: q }), 900);
        });
      }
    })
  );
});

self.addEventListener('message', (e) => {
  if (e.data.type === 'SET_SESSION') self._sid = e.data.sid;
  if (e.data.type === 'STOP')        self._sid = null;
  if (e.data.type === 'SCHEDULE') {
    const { question, ms, sid, nid } = e.data;
    setTimeout(() => {
      if (self._sid !== sid) return;
      self.registration.showNotification('🧠 MindPing — Savol!', {
        body: question.question,
        tag: 'mp-' + nid,
        data: question,
        requireInteraction: true,
        actions: [
          { action: 'answer', title: '✍️ Javob berish' },
          { action: 'skip',   title: "⏭ O'tkazish" },
        ],
      });
    }, ms);
  }
});
