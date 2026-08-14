// src/pages/Home.jsx
import { motion } from 'framer-motion';
import { Hero, ServicesPreview, TrustBar } from '../components/home';
import About from '../components/About';
import Services from '../components/Services';
import VisionMissionValues from '../components/VisionMissionValues';
import BrandPromise from '../components/BrandPromise';
import Contact from '../components/Contact';
import Testimonials from '../components/Testimonials';
import BundleBanner from '../components/BundleBanner';
import FeaturedProducts from '../components/FeaturedProducts';
import useHashScroll from '../hooks/useHashScroll';

const Home = () => {
  useHashScroll();
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <Hero />
      <ServicesPreview />
      <TrustBar />
      <FeaturedProducts />
      <BundleBanner />
      <About />
      <Services />
      <Testimonials />
      <VisionMissionValues />
      <BrandPromise />
      <Contact />
    </motion.div>
  );
};

export default Home;
