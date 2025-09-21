import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import DeliverablesSection from '@/components/home/DeliverablesSection';
import StatsSection from '@/components/home/StatsSection';
import PricingSection from '@/components/home/PricingSection';
import FinalCTASection from '@/components/home/FinalCTASection';
import { useNavigate } from 'react-router-dom';

const HomePage = ({ onUploadClick }) => {
  const navigate = useNavigate();

  return (
    <div>
      <HeroSection onUploadClick={onUploadClick} />
      <StatsSection />
      <div className="section-divider"></div>
      <FeaturesSection />
      <div className="section-divider"></div>
      <DeliverablesSection />
      <div className="section-divider"></div>
      <PricingSection onStartClick={onUploadClick} />
      <FinalCTASection onStartClick={onUploadClick} />
    </div>
  );
};

export default HomePage;