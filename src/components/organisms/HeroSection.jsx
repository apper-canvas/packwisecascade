import React from 'react';
import HeroContent from '../molecules/HeroContent';
import FeatureCard from '../molecules/FeatureCard';

const features = [
  {
    icon: "MapPin",
    title: "Smart Suggestions",
    description: "Get personalized packing lists based on your destination and activities"
  },
  {
    icon: "CheckCircle",
    title: "Track Progress",
    description: "Check off items as you pack and see your completion progress"
  },
  {
    icon: "Clock",
    title: "Last-Minute Alerts",
    description: "Get timely reminders for important pre-departure tasks"
  }
];

const HeroSection = () => {
  return (
    <section className="py-12 md:py-20 lg:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10"></div>
      <div className="container mx-auto px-4 relative z-10 max-w-6xl">
        <HeroContent />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12 lg:mb-16">
          {features.map((feature, index) => (
            <FeatureCard 
              key={feature.title} 
              icon={feature.icon} 
              title={feature.title} 
              description={feature.description} 
              index={index} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;