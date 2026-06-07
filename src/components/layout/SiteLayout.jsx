import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { MessageCircle } from 'lucide-react';
import CookieConsent from '@/components/CookieConsent';

export default function SiteLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <Outlet />
      </main>
      <CookieConsent />
      <Footer />
      {/* Floating WhatsApp button */}
      <a
        href="https://wa.me/6973620089"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-signal flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform glow-signal"
        title="Chat on WhatsApp"
      >
        <MessageCircle className="w-6 h-6 text-background" />
      </a>
    </div>
  );
}