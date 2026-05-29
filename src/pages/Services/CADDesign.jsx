import React from 'react';
import ServicePage from '../../components/shared/ServicePage';
import PricingTable from '../../components/services/PricingTable';

const CAD_IMG = 'https://media.base44.com/images/public/6a183d82770ee575c3658f58/c1f40b78e_generated_d277a8cd.png';

export default function CADDesign() {
  return (
    <>
      <ServicePage
        serviceKey="3d-cad"
        label="3D CAD Design"
        title="3D CAD & Mechanical Design"
        description="Transform your ideas into precise 3D models. Mechanical parts, robotics components, and electronics enclosures — all export-ready in STL and STEP formats."
        image={CAD_IMG}
        includes={[
          'Idea to 3D model conversion',
          'Mechanical parts design',
          'Robotics components and assemblies',
          'Electronics enclosures and housings',
          'Export in STL / STEP formats',
          'Design for 3D printing optimization',
          'Assembly documentation',
        ]}
        extras={[
          'Redesign and optimization of existing models',
          'Optimization for specific 3D printing processes',
          'Parametric design for easy modifications',
          'Structural analysis and recommendations',
        ]}
        ctaWhatsApp="Send Idea for 3D Design"
        ctaText="Have a design in mind?"
      />
      <PricingTable serviceKey="3d-cad" />
    </>
  );
}