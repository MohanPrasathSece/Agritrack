import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LandingNavbar from '../components/landing/LandingNavbar';
import HeroSection from '../components/landing/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import HowItWorksSection from '../components/landing/HowItWorksSection';
import MLSection from '../components/landing/MLSection';
import UserRolesSection from '../components/landing/UserRolesSection';
import ImpactSection from '../components/landing/ImpactSection';
import GallerySection from '../components/landing/GallerySection';
import FAQ from '../components/landing/FAQ';
import LandingFooter from '../components/landing/LandingFooter';
import FallingLeaves from '../components/landing/FallingLeaves';
import '../styles/landing.css';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect authenticated users to dashboard
    if (isAuthenticated) {
      navigate('/dashboard');
      return;
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-background text-foreground landing-page relative bg-gradient-to-b from-white to-emerald-50/20 overflow-x-hidden w-full">
      <FallingLeaves />
      <LandingNavbar />
      <HeroSection />
      <FeaturesSection />
      <div className="relative z-10 w-full overflow-x-hidden">
        <HowItWorksSection />
        <MLSection />
        <UserRolesSection />
        <ImpactSection />
        <GallerySection />
        <FAQ />
      </div>
      <LandingFooter />
    </div>
  );
};

export default Home;
