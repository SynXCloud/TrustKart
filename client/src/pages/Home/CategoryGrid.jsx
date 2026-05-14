import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const categories = [
  {
    id: 1,
    name: 'Handmade Crafts',
    image: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    itemCount: '1,204 Items',
  },
  {
    id: 2,
    name: 'Premium Fashion',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    itemCount: '856 Items',
  },
  {
    id: 3,
    name: 'Eco-Friendly',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    itemCount: '432 Items',
  },
  {
    id: 4,
    name: 'Tech Accessories',
    image: 'https://images.unsplash.com/photo-1528795259021-d8c86e14354c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    itemCount: '621 Items',
  },
];

const CategoryGrid = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-text">Shop by Category</h2>
            <p className="mt-2 text-muted">Explore our handpicked collections.</p>
          </div>
          <Link to="/categories" className="text-primary font-medium hover:text-emerald-700 transition-colors hidden sm:block">
            View All Categories &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Link key={category.id} to={`/products?category=${category.name}`}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="absolute inset-0">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </div>
                
                <div className="absolute bottom-0 left-0 p-6">
                  <h3 className="text-xl font-bold text-white mb-1">{category.name}</h3>
                  <p className="text-gray-300 text-sm font-medium">{category.itemCount}</p>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center sm:hidden">
          <Link to="/categories" className="text-primary font-medium hover:text-emerald-700 transition-colors">
            View All Categories &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
