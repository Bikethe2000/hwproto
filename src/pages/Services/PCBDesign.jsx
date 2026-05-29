import React from 'react';
import ServicePage from '../../components/shared/ServicePage';
import BOMUploader from '../../components/pcb/BOMUploader';
import PricingTable from '../../components/services/PricingTable';

const PCB_IMG = 'https://media.base44.com/images/public/6a183d82770ee575c3658f58/aab26640b_generated_515f32a3.png';

export default function PCBDesign() {
  return (
    <>
      <ServicePage
        serviceKey="pcb-design"
        label="PCB Design"
        title="Professional PCB Design Services"
        description="From schematic capture to manufacturing-ready PCB layouts. Specialized in robotics and embedded systems, with expertise in KiCad and EasyEDA."
        image={PCB_IMG}
        includes={[
          'Schematic design from your specifications',
          'PCB layout — single, double, or multi-layer',
          'KiCad / EasyEDA project files',
          'Bill of Materials (BOM) generation',
          'DFM optimization for manufacturing',
          'Robotics PCB specialization',
          'Gerber files ready for fabrication',
        ]}
        extras={[
          'PCB review and optimization service',
          'Debugging existing schematics',
          'Component sourcing assistance',
          'Manufacturer liaison and order support',
        ]}
        ctaWhatsApp="Request PCB Design on WhatsApp"
        ctaText="Need a custom PCB?"
      >
        <BOMUploader />
      </ServicePage>
      <PricingTable serviceKey="pcb-design" />
    </>
  );
}