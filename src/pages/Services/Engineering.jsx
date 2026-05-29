import React from 'react';
import ServicePage from '../../components/shared/ServicePage';
import PricingTable from '../../components/services/PricingTable';

const LAB_IMG = 'https://media.base44.com/images/public/6a183d82770ee575c3658f58/4c5b0814e_generated_5a7e46e3.png';

export default function Engineering() {
  return (
    <>
      <ServicePage
        serviceKey="engineering"
        label="Engineering Projects"
        title="Prototyping & Engineering Support"
        description="Professional engineering support for complete product development. From robotics systems to university capstone projects — we handle the full pipeline."
        image={LAB_IMG}
        includes={[
          'Full product development from concept to prototype',
          'Robotics systems design and integration',
          'Electronics + mechanical integration',
          'Firmware and software development',
          'Technical documentation and reports',
          'Student and university project assistance',
          'Competition-ready robotics builds',
        ]}
        extras={[
          'Patent-ready documentation',
          'Manufacturing transition support',
          'Ongoing technical consultation',
          'Training and knowledge transfer',
        ]}
        ctaWhatsApp="Discuss Full Project"
        ctaText="Have a complex project?"
      />
      <PricingTable serviceKey="engineering" />
    </>
  );
}