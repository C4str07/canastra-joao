const CACHE_NAME = 'canastra-v5';
// Lista exata de arquivos que precisam para rodar offline
const assetsToCache = [
  './',
  './index.html',
  './manifest.json',
  // Adicione ícones aqui se você os subiu para o repositório
];

// Instalação: Salva arquivos no cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto');
        // Usamos addAll mas tentamos cachear item por item para evitar que um erro trave tudo
        return cache.addAll(assetsToCache.map(url => new Request(url, {credentials: 'same-origin'})));
      })
  );
});

// Ativação: Limpa caches antigos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    })
  );
});

// Busca (Fetch): Tenta pegar do cache primeiro, se não tiver, vai na rede
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Retorna do cache
        }
        return fetch(event.request); // Vai na rede
      })
  );
});
