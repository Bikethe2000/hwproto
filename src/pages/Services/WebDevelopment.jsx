import React from 'react';
import ServicePage from '../../components/shared/ServicePage';
import PricingTable from '../../components/services/PricingTable';

const IMG = 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=1200&q=80';

export default function WebDevelopment() {
  return (
    <>
      <ServicePage
        serviceKey="web-development"
        label="Web Development"
        title="Website Development"
        description="Modern, responsive websites for businesses, professionals, and startups. Landing pages, portfolio sites, business websites, and custom web apps with fast performance and mobile-first design."
        image={IMG}
        includes={[
          'Custom design tailored to your brand',
          'Fully responsive & mobile-optimized',
          'Landing pages, portfolio & business sites',
          'Custom web application development',
          'Fast performance & SEO-ready structure',
          'Contact forms & lead capture',
          'Deployment and domain setup assistance',
        ]}
        extras={[
          'AI chatbot integration',
          'Booking system integration',
          'E-commerce functionality',
          'Ongoing maintenance plan',
        ]}
        ctaWhatsApp="Discuss Website Project"
        ctaText="Ready to build your website?"
      />
      <PricingTable serviceKey="web-development" />
    </>
  );
}