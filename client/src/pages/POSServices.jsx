// src/pages/POSServices.jsx
import { CreditCard, Zap, Users, TrendingUp, Smartphone, Repeat } from 'lucide-react';
import ServicePageLayout from '../components/ServicePageLayout';

const features = [
  { icon: CreditCard, title: 'POS Terminals', desc: 'Reliable machines for seamless transactions.' },
  { icon: Zap, title: 'Fast Settlements', desc: 'Quick and secure payment processing.' },
  { icon: Users, title: 'Business Support', desc: 'Dedicated support for merchants.' },
  { icon: TrendingUp, title: 'Sales Reports', desc: 'Detailed analytics to track growth.' },
  { icon: Smartphone, title: 'Mobile Integration', desc: 'Manage payments from your smartphone.' },
  { icon: Repeat, title: 'Utility Subscriptions', desc: 'Easy payment for electricity, TV, and more.' },
];

const POSServices = () => (
  <ServicePageLayout
    eyebrow="POS & Utilities"
    title="POS Services &"
    titleAccent="Utility Subscriptions"
    subtitle="Streamlined payment solutions and utility bill payments for businesses and individuals. Easy, fast, and secure."
    features={features}
    ctaLabel="Call to Inquire"
    ctaHref="tel:08182799154"
    footerNote="Whether you need a POS terminal for your shop or want to pay utility bills instantly — we've got you covered."
  />
);

export default POSServices;
