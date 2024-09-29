self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open('game-cache').then((cache) => {
        return cache.addAll([
          '/',
          '/project.html',
          '/cpu2048.css',
          '/cpu2048.js',
          '/Cpu_logo_192.jpg',
          '/Cpu_logo_512.jpg'
        ]);
      })
    );
  });
  
  self.addEventListener('fetch', (event) => {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  });
  