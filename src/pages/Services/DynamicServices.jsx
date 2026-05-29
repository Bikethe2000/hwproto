import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { api } from '@/api/apiClient';
import { Loader2 } from 'lucide-react';
import ServicePage from '../../components/shared/ServicePage';
import PricingTable from '../../components/services/PricingTable';

/**
 * DynamicServicePage
 *
 * Renders any service page whose content lives in the ServiceContent collection.
 * Used as a catch-all route: /services/:serviceKey
 *
 * In your router, add this AFTER all your static service routes so they keep
 * priority, and any newly added service falls through to this component:
 *
 *   <Route path="/services/:serviceKey" element={<DynamicServicePage />} />
 */
export default function DynamicServicePage() {
  const { serviceKey } = useParams();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setNotFound(false);
      try {
        const results = await api.entities.ServiceContent.filter({ service_key: serviceKey });
        if (results.length > 0) {
          setContent(results[0]);
        } else {
          setNotFound(true);
        }
      } catch (e) {
        setNotFound(true);
      }
      setLoading(false);
    };
    load();
  }, [serviceKey]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (notFound) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <ServicePage
        serviceKey={content.service_key}
        label={content.title}
        title={content.title}
        description={content.description}
        image={content.hero_image_url}
        includes={content.includes || []}
        extras={content.extras || []}
        ctaText={content.cta_heading}
        ctaWhatsApp={content.cta_whatsapp_text}
      />
      <PricingTable serviceKey={content.service_key} />
    </>
  );
}