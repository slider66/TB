import React from 'react';
import PricingSection from '@/components/home/PricingSection';

const PricingPage = ({ onStartClick }) => {
  return (
    <div className="py-20 md:py-28">
      <PricingSection onStartClick={onStartClick} isPage={true} />
    </div>
  );
};

export default PricingPage;
