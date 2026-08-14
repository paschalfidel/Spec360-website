// src/pages/Connectivity.jsx
import { Wifi, Server, Network, Radio, Cable, Satellite } from 'lucide-react';
import ServicePageLayout from '../components/ServicePageLayout';

const features = [
  { icon: Wifi, title: 'Business Wi-Fi', desc: 'Reliable high-speed internet for your office.' },
  { icon: Server, title: 'Network Setup', desc: 'Professional installation and configuration.' },
  { icon: Network, title: 'VPN Solutions', desc: 'Secure remote access for your team.' },
  { icon: Radio, title: 'Wireless Bridges', desc: 'Connect remote sites wirelessly.' },
  { icon: Cable, title: 'Structured Cabling', desc: 'Organized and future-proof cabling.' },
  { icon: Satellite, title: 'Backup Connectivity', desc: 'Redundant links to avoid downtime.' },
];

const Connectivity = () => (
  <ServicePageLayout
    eyebrow="Connectivity"
    title="Business"
    titleAccent="Connectivity Solutions"
    subtitle="Keep your business connected with reliable internet, networking, and communication infrastructure. We design and deploy solutions that ensure seamless operations."
    features={features}
    ctaLabel="Get a Quote"
    ctaHref="tel:08182799154"
    footerNote="From small offices to large enterprises, we provide connectivity solutions that scale with your business."
  />
);

export default Connectivity;
