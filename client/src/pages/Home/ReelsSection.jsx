import React from 'react';
import { motion } from 'framer-motion';
import { FiPlay } from 'react-icons/fi';

const mockReels = [
  {
    id: 'r1',
    thumbnail: 'https://images.unsplash.com/photo-1523381294911-8d3cead13475?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    title: 'Styling the new summer collection',
    views: '12k',
  },
  {
    id: 'r2',
    thumbnail: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    title: 'Handmade leather shoes process',
    views: '45k',
  },
  {
    id: 'r3',
    thumbnail: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    title: 'Testing the new tech accessories',
    views: '8.5k',
  },
  {
    id: 'r4',
    thumbnail: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    title: 'Eco-friendly packaging reveal',
    views: '22k',
  },
];

const ReelsSection = () => {
  return (
    <section className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-white">Discover on Reels</h2>
            <p className="mt-2 text-gray-400">Watch product demos and creator stories.</p>
          </div>
        </div>

        <div className="flex overflow-x-auto pb-8 -mx-4 px-4 sm:mx-0 sm:px-0 gap-4 snap-x hide-scrollbar">
          {mockReels.map((reel, index) => (
            <motion.div
              key={reel.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="relative min-w-[200px] w-[200px] sm:min-w-[240px] sm:w-[240px] h-[360px] sm:h-[420px] flex-shrink-0 snap-start rounded-2xl overflow-hidden cursor-pointer group"
            >
              <img 
                src={reel.thumbnail} 
                alt={reel.title} 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />
              
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-14 h-14 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                  <FiPlay size={24} className="ml-1" />
                </div>
              </div>

              <div className="absolute bottom-0 left-0 p-4 w-full">
                <p className="text-white font-medium text-sm line-clamp-2 mb-1">{reel.title}</p>
                <div className="flex items-center text-xs text-gray-300">
                  <FiPlay size={12} className="mr-1" /> {reel.views} views
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReelsSection;
