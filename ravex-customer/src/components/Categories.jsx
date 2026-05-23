import { categories } from '../data/products';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Categories = () => {
  return (
    <section id="categories" className="py-24 bg-background">
      <div className="container px-6 mx-auto">
        <div className="text-center mb-16">
          <span className="text-tiffany font-black tracking-[0.4em] uppercase text-[10px] mb-4 block">
            Setup Your Zone
          </span>
          <h2 className="text-4xl md:text-5xl font-black font-display uppercase tracking-tighter">
            SHOP BY <span className="text-tiffany">COLLECTION</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.name}
              to="/shop"
              className="relative group h-[450px] rounded-[1.2rem] overflow-hidden cursor-pointer"
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-10">
                <h3 className="text-2xl font-black font-display uppercase tracking-tight text-white group-hover:text-tiffany transition-colors">
                  {category.name}
                </h3>
                <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] mt-3">
                  Explore Gear
                </p>
                <div className="w-8 h-1 bg-tiffany mt-6 transition-all duration-500 group-hover:w-full"></div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
