import React, { useEffect, useState } from 'react';

const App: React.FC = () => {
  const [pingTime, setPingTime] = useState<number | string>('-');
  const [selectedProvider, setSelectedProvider] = useState<string>('https://cloudflare.com/cdn-cgi/trace');
  const providers = [
    { id: 'local', value: '/ping', name: 'localdomain' },
    { id: 'bunny', value: 'https://jsdelivr.b-cdn.net/gh/ihsangan/htpping/ping', name: 'bunny.net [anycast]' },
    { id: 'cloudflare', value: 'https://cloudflare.com/cdn-cgi/trace', name: 'CloudFlare [anycast]' },
    { id: 'fastly', value: 'https://time.fastly.net/', name: 'Fastly [anycast]' },
    { id: 'google', value: 'https://gcping.com/api/ping', name: 'Google Cloud [anycast]' },
    { id: 'jsdelivr', value: 'https://cdn.jsdelivr.net/gh/ihsangan/httping/ping', name: 'jsDelivr [anycast] [multi provider]' },
    { id: 'nextdns', value: 'https://dns.nextdns.io/info', name: 'NextDNS [anycast] [multi provider]' }
  ];

  const mean = 20;
  const interval = 350;

  const ping = () => {
    const start = Date.now();
    fetch(`${selectedProvider}?${start}`, {
      method: "GET",
      cache: "no-store"
    }).then(() => {
      const timeTaken = Date.now() - start - mean;
      setPingTime(timeTaken);
    }).catch((error) => console.error('Ping error:', error));
  };

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const selected = providers.find(provider => provider.id === hash);
    if (selected) {
      setSelectedProvider(selected.value);
    }
    ping();
    const intervalId = setInterval(ping, interval);
    return () => clearInterval(intervalId);
  }, [selectedProvider]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = event.target.options[event.target.selectedIndex].id;
    setSelectedProvider(event.target.value);
    window.location.hash = selectedId;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300">
      <div className="mb-2">
        <select
          id="provider"
          value={selectedProvider}
          onChange={handleChange}
          className="p-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded border border-gray-300 dark:border-gray-700"
        >
          {providers.map((provider) => (
            <option key={provider.id} value={provider.value} id={provider.id}>
              {provider.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center mb-12">
        <div id="ping" className="text-6xl font-medium">{pingTime}</div>
        <div className="ml-1.5 mb-8 text-4xl">ms</div>
      </div>
    </div>
  );
};

export default App;