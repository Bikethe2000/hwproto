import React from 'react';
import ServicePage from '../../components/shared/ServicePage';
import PricingTable from '../../components/services/PricingTable';

const SOLDER_IMG = 'https://media.base44.com/images/public/6a183d82770ee575c3658f58/525ab24de_generated_13e0d6d4.png';

export default function MicroSoldering() {
  return (
    <>
      <ServicePage
        serviceKey="micro-soldering"
        label="Micro Soldering"
        title="Micro Soldering & PCB Repair"
        description="Precision SMD soldering, component replacement, and board-level repair. Expertise with Arduino, ESP, and custom PCB assemblies."
        image={SOLDER_IMG}
        includes={[
          'SMD soldering (down to 0402 packages)',
          'PCB repair and rework',
          'Component replacement',
          'Arduino / ESP module repair',
          'Connector rework and replacement',
          'Quality inspection under microscope',
        ]}
        extras={[
          'Board-level diagnostics',
          'Custom cable and harness assembly',
          'Conformal coating application',
        ]}
        ctaWhatsApp="Request Repair Service"
        ctaText="Need repair or soldering?"
      />
      <PricingTable serviceKey="micro-soldering" />
    </>
  );
}