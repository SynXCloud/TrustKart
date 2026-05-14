import React from 'react';
import Hero from './Home/Hero';
import CategoryGrid from './Home/CategoryGrid';
import TrendingProducts from './Home/TrendingProducts';
import SellerSpotlight from './Home/SellerSpotlight';
import ReelsSection from './Home/ReelsSection';
import TrustBanner from './Home/TrustBanner';

const Home = () => {
  return (
    <div className="bg-background">
      <Hero />
      <CategoryGrid />
      <TrendingProducts />
      <ReelsSection />
      <SellerSpotlight />
      <TrustBanner />
    </div>
  );
};

export default Home;
