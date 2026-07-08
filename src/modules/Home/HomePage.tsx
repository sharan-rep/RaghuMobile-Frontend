import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Button } from '../../app/components/ui/button';
import { Card, CardContent } from '../../app/components/ui/card';
import { Badge } from '../../app/components/ui/badge';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '../../app/components/ui/carousel';
import logoImage from '../../assets/logo.png';
import { useProducts } from '../../app/context/ProductContext';
import { useCustomerAuth } from '../../app/context/CustomerAuthContext';
import { useCart } from '../../app/context/CartContext';
import {
  Star,
  Truck,
  Shield,
  CreditCard,
  Award,
  ChevronRight,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';
import { motion } from 'motion/react';

const FADE_UP_VARIANTS = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100 } },
};

export default function HomePage() {
  const { products } = useProducts();
  const [api, setApi] = useState<CarouselApi>();
  const { isAuthenticated } = useCustomerAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (!api) return;
    const interval = setInterval(() => {
      api.scrollNext();
    }, 6000);
    return () => clearInterval(interval);
  }, [api]);

  const banners = [
    {
      id: 1,
      title: 'Experience Next-Gen Technology',
      description: 'Discover the ultimate collection of premium second-hand devices at unbeatable wholesale prices.',
      badge: 'New Collection',
      image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80',
      bgColor: 'from-slate-950 via-slate-900 to-indigo-950',
      accentColor: 'text-blue-400',
      primaryText: 'Shop Now',
      primaryLink: '/products',
    },
    {
      id: 2,
      title: 'Premium Smartwatches Collection',
      description: 'Elevate your lifestyle with our curated selection of pristine condition smartwatches.',
      badge: 'Trending Now',
      image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80',
      bgColor: 'from-slate-950 via-gray-900 to-purple-950',
      accentColor: 'text-purple-400',
      primaryText: 'Explore Watches',
      primaryLink: '/products?category=smartwatch',
    }
  ];

  const features = [
    { icon: Truck, title: 'Free Delivery', desc: 'On orders above ₹5,000' },
    { icon: Shield, title: 'Secure Warranty', desc: '100% covered protection' },
    { icon: CreditCard, title: 'Easy Finance', desc: 'Flexible EMI options' },
    { icon: Award, title: 'Verified Quality', desc: 'Rigorous 40-point check' },
  ];

  return (
    <div className="font-sans overflow-hidden">
      
      {/* Hero Section */}
      <section className="relative bg-slate-950">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px]" />
        </div>
        
        <Carousel setApi={setApi} className="w-full relative z-10" opts={{ loop: true }}>
          <CarouselContent>
            {banners.map((banner) => (
              <CarouselItem key={banner.id}>
                <div className={`relative w-full bg-gradient-to-br ${banner.bgColor} text-white min-h-[85vh] flex items-center`}>
                  <div className="container mx-auto px-4 md:px-8 py-20">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                      <motion.div 
                        initial="hidden" animate="show" 
                        variants={{
                          hidden: { opacity: 0 },
                          show: { opacity: 1, transition: { staggerChildren: 0.2 } }
                        }}
                        className="max-w-2xl"
                      >
                        <motion.div variants={FADE_UP_VARIANTS}>
                          <Badge className="mb-6 bg-white/10 hover:bg-white/20 text-white border-white/20 px-4 py-1.5 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider">
                            <Sparkles className={`w-3.5 h-3.5 mr-2 ${banner.accentColor}`} />
                            {banner.badge}
                          </Badge>
                        </motion.div>
                        <motion.h1 variants={FADE_UP_VARIANTS} className="text-5xl md:text-7xl font-bold mb-6 leading-[1.1] tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-white/70">
                          {banner.title}
                        </motion.h1>
                        <motion.p variants={FADE_UP_VARIANTS} className="text-lg md:text-xl mb-10 text-slate-300 font-light leading-relaxed max-w-xl">
                          {banner.description}
                        </motion.p>
                        <motion.div variants={FADE_UP_VARIANTS} className="flex flex-wrap gap-4">
                          <Button size="lg" className="rounded-full h-14 px-8 bg-white text-slate-950 hover:bg-slate-100 hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.3)]" asChild>
                            <Link to={banner.primaryLink} className="text-base font-semibold">
                              {banner.primaryText}
                              <ChevronRight className="w-5 h-5 ml-2" />
                            </Link>
                          </Button>
                        </motion.div>
                      </motion.div>
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 1, type: "spring", bounce: 0.4 }}
                        className="hidden lg:flex justify-center relative"
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10 rounded-[40px]"></div>
                        <img
                          src={banner.image}
                          alt={banner.title}
                          className="rounded-[40px] shadow-2xl h-[500px] w-full max-w-md object-cover border border-white/10"
                        />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 z-20">
            <CarouselPrevious className="relative inset-0 translate-x-0 translate-y-0 bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white backdrop-blur-md h-12 w-12 rounded-full transition-all" />
            <CarouselNext className="relative inset-0 translate-x-0 translate-y-0 bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white backdrop-blur-md h-12 w-12 rounded-full transition-all" />
          </div>
        </Carousel>
      </section>

      {/* Trust Features */}
      <section className="py-20 bg-[#F8FAFC]">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature, idx) => (
              <motion.div key={idx} variants={FADE_UP_VARIANTS}>
                <Card className="border-none shadow-sm hover:shadow-md transition-all duration-300 bg-white group rounded-3xl overflow-hidden">
                  <CardContent className="p-8 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-50 transition-all duration-500">
                      <feature.icon className="w-8 h-8 text-slate-700 group-hover:text-blue-600 transition-colors" />
                    </div>
                    <h3 className="font-bold text-lg text-slate-900 mb-2">{feature.title}</h3>
                    <p className="text-sm text-slate-500 font-medium">{feature.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl"
            >
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
                Latest Arrivals
              </h2>
              <p className="text-lg text-slate-500 font-medium">
                Experience the pinnacle of innovation with our newly stocked premium devices.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Button variant="outline" className="rounded-full h-12 px-6 border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-blue-600" asChild>
                <Link to="/products">
                  View All Collection
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.slice(0, 4).map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <Card className="group border-none shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] transition-all duration-500 bg-white rounded-[24px] overflow-hidden flex flex-col h-full relative">
                  {/* Image Container */}
                  <Link to={`/products/${product.id}`} className="block relative bg-[#F8FAFC] pt-8 pb-6 px-6 overflow-hidden">
                    <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                      {product.originalPrice && (
                        <Badge className="bg-red-500 text-white border-none px-3 py-1 text-xs font-bold shadow-sm rounded-full">
                          Sale
                        </Badge>
                      )}
                      {product.inStock && (
                        <Badge className="bg-emerald-500 text-white border-none px-3 py-1 text-xs font-bold shadow-sm rounded-full">
                          In Stock
                        </Badge>
                      )}
                    </div>
                    <motion.img
                      whileHover={{ scale: 1.08 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      src={product.image}
                      alt={product.name}
                      className="w-full h-56 object-contain mix-blend-multiply filter contrast-105"
                    />
                  </Link>

                  {/* Content Container */}
                  <CardContent className="p-6 flex flex-col flex-grow bg-white">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      </div>
                      <span className="text-xs font-semibold text-slate-400">({product.reviews})</span>
                    </div>
                    
                    <p className="text-xs font-bold tracking-wider text-blue-600 uppercase mb-2">{product.brand}</p>
                    <Link to={`/products/${product.id}`} className="group-hover:text-blue-600 transition-colors">
                      <h3 className="font-bold text-lg text-slate-900 leading-tight mb-4 line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>
                    
                    <div className="mt-auto pt-4 flex items-end justify-between border-t border-slate-100">
                      <div className="flex flex-col">
                        <span className="text-xs text-slate-500 font-medium mb-1">Price</span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-extrabold text-slate-900">₹{product.price.toLocaleString('en-IN')}</span>
                          {product.originalPrice && (
                            <span className="text-sm text-slate-400 line-through font-medium">
                              ₹{product.originalPrice.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex gap-3">
                      <Button 
                        variant="outline"
                        className="flex-1 rounded-xl h-12 border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-blue-600 font-bold transition-all"
                        onClick={(e) => {
                          e.preventDefault();
                          if (!isAuthenticated) navigate('/login');
                          else addToCart({ id: product.id, name: product.name, price: product.price, image: product.image });
                        }}
                      >
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        Cart
                      </Button>
                      <Button 
                        className="flex-1 rounded-xl h-12 bg-slate-900 hover:bg-blue-600 text-white font-bold transition-all shadow-md hover:shadow-blue-500/25"
                        onClick={(e) => {
                          e.preventDefault();
                          if (!isAuthenticated) navigate('/login');
                          else {
                            addToCart({ id: product.id, name: product.name, price: product.price, image: product.image });
                            navigate('/cart');
                          }
                        }}
                      >
                        Buy Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-10"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent"></div>
        </div>
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
              Upgrade Your Tech <br/>
              <span className="text-blue-400">Today.</span>
            </h2>
            <p className="text-lg text-slate-300 mb-10 font-light">
              Join thousands of satisfied customers who found their perfect device at Raghu Mobile Wholesale.
            </p>
            <Button size="lg" className="rounded-full h-14 px-8 bg-blue-600 hover:bg-blue-500 text-white border-none shadow-[0_0_40px_rgba(37,99,235,0.4)] transition-all hover:scale-105" asChild>
              <Link to="/products" className="text-base font-semibold">
                Start Exploring Now
                <ChevronRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
      
    </div>
  );
}