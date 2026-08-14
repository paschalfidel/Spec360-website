// src/pages/WebDevelopment.jsx
import { Code, Globe, Smartphone, Database, Rocket, Shield } from 'lucide-react';
import ServicePageLayout from '../components/ServicePageLayout';

const features = [
  { icon: Globe, title: 'Custom Websites', desc: 'Responsive, modern websites tailored to your brand.' },
  { icon: Smartphone, title: 'Mobile-First Design', desc: 'Optimized for all devices, especially mobile.' },
  { icon: Database, title: 'Full-Stack Applications', desc: 'Scalable apps with Node.js, React, and MongoDB.' },
  { icon: Rocket, title: 'Performance Optimization', desc: 'Fast load times and SEO-friendly structure.' },
  { icon: Shield, title: 'Secure & Reliable', desc: 'Best practices in security and data protection.' },
  { icon: Code, title: 'Maintenance & Support', desc: 'Ongoing updates and technical support.' },
];

const WebDevelopment = () => (
  <ServicePageLayout
    eyebrow="Web Development"
    title="Full-Stack"
    titleAccent="Web Development"
    subtitle="We design and build functional, scalable web solutions that solve real-world problems. From simple business websites to complex web applications — some already in production."
    features={features}
    ctaLabel="Start a Project"
    ctaHref="tel:08182799154"
    footerNote="Some of our digital products are already live and in production, with more problem-solving projects continuously in development."
  />
);

export default WebDevelopment;
