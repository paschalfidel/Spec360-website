// src/pages/Repairs.jsx
import { Wrench, Battery, Droplet, Cpu, Smartphone, Shield } from 'lucide-react';
import ServicePageLayout from '../components/ServicePageLayout';

const features = [
  { icon: Smartphone, title: 'Screen Replacement', desc: 'Cracked screen? Fixed fast with quality parts.' },
  { icon: Battery, title: 'Battery Replacement', desc: 'Extend your device life with a fresh battery.' },
  { icon: Droplet, title: 'Water Damage Repair', desc: 'Specialized cleaning and component-level repair.' },
  { icon: Cpu, title: 'Software Troubleshooting', desc: 'OS issues, boot loops, and app crashes resolved.' },
  { icon: Wrench, title: 'Hardware Repairs', desc: 'Charging ports, cameras, buttons, and more.' },
  { icon: Shield, title: 'Ongoing Tech Support', desc: 'Advice, setup, and maintenance for your devices.' },
];

const Repairs = () => (
  <ServicePageLayout
    eyebrow="Repairs"
    title="Phone Repairs &"
    titleAccent="Tech Support"
    subtitle="Expert repairs including screen replacement, battery, water damage, and software troubleshooting. Fast, reliable, and backed by real expertise."
    features={features}
    ctaLabel="Get a Repair Quote"
    ctaHref="tel:08182799154"
    footerNote="Most repairs are completed same-day. Call us to get a free quote before you bring your device in."
  />
);

export default Repairs;
