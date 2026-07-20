// Minimal shell — OneSignal handles all push events via OneSignalSDKWorker.js
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
