import React from 'react';
import ServicePage from '../../components/shared/ServicePage';
import PricingTable from '../../components/services/PricingTable';

const IMG = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80';

export default function DashboardDev() {
  return (
    <>
      <ServicePage
        serviceKey="dashboard-dev"
        label="Dashboards"
        title="Dashboard & Admin Panel Development"
        description="Custom dashboards and admin panels for data management, analytics, bookings, IoT devices, and real-time monitoring. Organized visualization in a user-friendly environment."
        image={IMG}
        includes={[
          'Custom dashboard UI design and development',
          'Data visualization (charts, tables, KPIs)',
          'Real-time data monitoring',
          'IoT device management interface',
          'Booking and order management panels',
          'User roles and access control',
          'Export to CSV / PDF',
        ]}
        extras={[
          'Mobile app companion view',
          'Third-party API integrations',
          'Automated reporting and alerts',
          'White-label theming',
        ]}
        ctaWhatsApp="Discuss Dashboard Project"
        ctaText="Need a custom admin panel?"
      />
      <PricingTable serviceKey="dashboard-dev" />
    </>
  );
}