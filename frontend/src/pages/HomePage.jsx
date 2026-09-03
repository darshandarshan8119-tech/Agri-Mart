import { useRef } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Hero from '../components/home/Hero';
import About from '../components/home/About';
import Features from '../components/home/Features';
import Workflow from '../components/home/Workflow';
import Benefits from '../components/home/Benefits';
import Marketplace from '../components/home/Marketplace';
import CTA from '../components/home/CTA';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function HomePage() {
  const mainRef = useRef(null);
  useScrollReveal(mainRef);

  return (
    <>
      <Navbar />
      <main ref={mainRef}>
        <Hero />
        <About />
        <Features />
        <Workflow />
        <Benefits />
        <Marketplace />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
