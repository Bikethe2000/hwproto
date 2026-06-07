import React from 'react';
import ServicePage from '../../components/shared/ServicePage';
import PricingTable from '../../components/services/PricingTable';

const IMG = 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1200&q=80';

export default function MVPDev() {
  return (
    <>
      <ServicePage
        serviceKey="mvp-dev"
        label="MVP Development"
        title="MVP & Prototype Development for Startups"
        description="Turn your idea into a working product. From web apps and AI integrations to smart device prototypes and dashboards — built fast to validate your concept with clients or investors."
        image={IMG}
        includes={[
          'Concept scoping and technical roadmap',
          'Full-stack web app development',
          'AI feature integration (chatbots, automation)',
          'Smart device & hardware prototypes',
          'Dashboard or admin panel if needed',
          'Investor/demo-ready presentation build',
          'Deployment and handover',
        ]}
        extras={[
          'Post-MVP iteration and feature expansion',
          'Pitch deck technical support',
          'User testing and feedback integration',
          'Ongoing development retainer',
        ]}
        ctaWhatsApp="Discuss MVP Project"
        ctaText="Ready to build your MVP?"
      />
      <PricingTable serviceKey="mvp-dev" />
    </>
  );
}