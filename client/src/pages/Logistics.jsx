// src/pages/Logistics.jsx
import { Truck, Package, Clock, Map, Shield, Users } from 'lucide-react';
import ServicePageLayout from '../components/ServicePageLayout';

const features = [
  { icon: Truck, title: 'Local Deliveries', desc: 'Fast and reliable delivery within Owerri and surroundings.' },
  { icon: Map, title: 'Interstate Shipping', desc: 'Secure shipping to major cities across Nigeria.' },
  { icon: Clock, title: 'Real-Time Tracking', desc: 'Track your package every step of the way.' },
  { icon: Package, title: 'Careful Handling', desc: 'Your items are packed and handled with utmost care.' },
  { icon: Shield, title: 'Insurance Options', desc: 'Optional insurance for high-value shipments.' },
  { icon: Users, title: 'Business Logistics', desc: 'Tailored bulk delivery and scheduled pickups.' },
];

const Logistics = () => (
  <ServicePageLayout
    eyebrow="Logistics"
    title="Logistics &"
    titleAccent="Delivery Services"
    subtitle="Safe, timely, and reliable delivery of products and packages — local and interstate. Whether you need documents, gadgets, or bulk shipments, we've got you covered."
    features={features}
    ctaLabel="Schedule a Pickup"
    ctaHref="tel:08182799154"
    footerNote="Need a quick delivery or have special requirements? Call us and we'll sort it out."
  />
);

export default Logistics;
