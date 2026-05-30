import React, { useEffect, useState } from 'react';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = typeof window !== 'undefined' ? window.localStorage.getItem('hwproto_cookies_accepted') : null;
    if (!accepted) setVisible(true);
  }, []);

  const accept = () => {
    if (typeof window !== 'undefined') window.localStorage.setItem('hwproto_cookies_accepted', 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 sm:left-auto sm:right-6 z-50 p-4 bg-card border border-border rounded-md shadow-lg flex items-center gap-4">
      <div className="flex-1 text-sm text-muted-foreground">
        We use cookies to provide and improve our services. By continuing, you agree to our use of cookies. See our <a href="/cookies" className="text-primary underline">Cookies</a> page.
      </div>
      <div className="flex items-center gap-3">
        <button onClick={accept} className="px-4 py-2 bg-primary text-background rounded-md">Accept</button>
      </div>
    </div>
  );
}
