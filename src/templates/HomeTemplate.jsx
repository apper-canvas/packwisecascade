import React, { useState, useEffect } from 'react';
import PageHeader from '../components/molecules/PageHeader';
import HeroSection from '../components/organisms/HeroSection';
import Footer from '../components/molecules/Footer';
import MainFeatureSection from '../components/organisms/MainFeatureSection'; // This will be the refactored MainFeature

const HomeTemplate = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen">
      <PageHeader darkMode={darkMode} setDarkMode={setDarkMode} />
      <HeroSection />
      <MainFeatureSection />
      <Footer />
    </div>
  );
};

export default HomeTemplate;