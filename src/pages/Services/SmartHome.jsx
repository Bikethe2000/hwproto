import React from 'react';
import ServicePage from '../../components/shared/ServicePage';
import PricingTable from '../../components/services/PricingTable';

const IMG = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80';

export default function SmartHome() {
  return (
    <>
      <ServicePage
        serviceKey="smart-home"
        label="Smart Home"
        title="Smart Home & Automation Solutions"
        description="Practical smart automation systems for homes and offices. Voice assistants, device control, computer automations, and smart room setups — all tailored to your lifestyle."
        image={IMG}
        includes={[
          'Custom smart home/office automation design',
          'Voice assistant setup and integration',
          'Voice-controlled device configuration',
          'Computer and workflow automations',
          'Smart room setup (lighting, sensors, etc.)',
          'On-site or remote installation support',
          'User guide and handover',
        ]}
        extras={[
          'Remote monitoring and management',
          'Expansion to additional rooms',
          'Integration with existing smart devices',
          'Scheduled automation routines',
        ]}
        ctaWhatsApp="Discuss Smart Home Setup"
        ctaText="Ready to automate your space?"
      />
      <PricingTable serviceKey="smart-home" />
    </>
  );
}