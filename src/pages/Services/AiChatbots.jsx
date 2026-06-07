import React from 'react';
import ServicePage from '../../components/shared/ServicePage';
import PricingTable from '../../components/services/PricingTable';

const IMG = 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1200&q=80';

export default function AIChatbots() {
  return (
    <>
      <ServicePage
        serviceKey="ai-chatbots"
        label="AI Chatbots"
        title="AI Chatbots for WhatsApp, Telegram & Websites"
        description="Smart AI assistants that automatically respond to your customers 24/7 across WhatsApp, Telegram, or your website. Perfect for cafés, e-shops, Airbnbs, and small businesses."
        image={IMG}
        includes={[
          'Custom AI assistant trained on your business info',
          'WhatsApp, Telegram, or website chat integration',
          'FAQ answering & product/service information',
          'Booking and order assistance flows',
          '24/7 automated customer support',
          'Handoff to human agent when needed',
          'Setup, testing, and deployment',
        ]}
        extras={[
          'Monthly maintenance & updates package',
          'Multi-language support',
          'CRM or Google Sheets integration',
          'Analytics dashboard for conversation insights',
        ]}
        ctaWhatsApp="Discuss AI Chatbot Project"
        ctaText="Want smarter customer support?"
      />
      <PricingTable serviceKey="ai-chatbots" />
    </>
  );
}