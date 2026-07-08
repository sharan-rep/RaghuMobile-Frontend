import { Link, useLocation } from 'react-router';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from './ui/sheet';
import {
  Menu,
  CalendarDays,
  ShoppingCart,
  User,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import logoImage from '@/assets/logo.png';
import { motion } from 'motion/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export function Header() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { totalItems } = useCart();
  const { customer, isAuthenticated, logout } = useCustomerAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'About', to: '/about' },
    { label: 'Contact', to: '/contact' },
  ];

  const isActive = (path: string) =>
    path === '/'
      ? location.pathname === '/'
      : location.pathname.startsWith(path);

  // Pages with a dark or vibrant background at the top, where header text needs to be light
  const isDarkHero = ['/', '/about', '/contact'].includes(location.pathname);
  const useLightText = !scrolled && isDarkHero;

  return (
    <header 
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled 
          ? 'bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm py-2' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-800 text-white shadow-lg overflow-hidden group-hover:scale-105 transition-transform duration-300">
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <img src={logoImage} alt="Logo" className="w-6 h-6 object-contain z-10 drop-shadow-md" />
            </div>
            <div className="flex flex-col">
              <span className={`font-bold text-lg leading-tight tracking-tight transition-colors ${useLightText ? 'text-white' : 'text-red-600'}`}>
                Raghu Mobile <span className={useLightText ? 'text-blue-200' : 'text-blue-600'}>Wholesale</span>
              </span>
              <span className={`text-[10px] font-medium tracking-wider uppercase transition-colors ${useLightText ? 'text-white/70' : 'text-gray-500'}`}>
                Erode's Trusted Store
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {navLinks.map(link => {
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative font-medium text-sm transition-colors py-2 ${
                    active 
                      ? (useLightText ? 'text-white font-bold' : 'text-blue-600')
                      : (useLightText ? 'text-white/80 hover:text-white' : 'text-gray-600 hover:text-blue-600')
                  }`}
                >
                  {link.label}
                  {active && (
                    <motion.div 
                      layoutId="header-active-tab"
                      className={`absolute left-0 right-0 bottom-0 h-0.5 rounded-full ${useLightText ? 'bg-white' : 'bg-blue-600'}`}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated && customer ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className={`text-sm font-medium transition-colors flex items-center gap-2 ${useLightText ? 'text-white/90 hover:text-white' : 'text-gray-600 hover:text-blue-600'}`}>
                    <User className="w-4 h-4" />
                    <span>{customer.name}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/track-order" className="cursor-pointer">Order History</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login" className={`text-sm font-medium transition-colors flex items-center gap-2 ${useLightText ? 'text-white/90 hover:text-white' : 'text-gray-600 hover:text-blue-600'}`}>
                <User className="w-4 h-4" />
                <span>Login</span>
              </Link>
            )}
            
            <Link to="/cart" className={`relative p-2 transition-colors group ${useLightText ? 'text-white hover:text-blue-200' : 'text-gray-600 hover:text-blue-600'}`}>
              <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {totalItems > 0 && (
                <span className={`absolute top-0 right-0 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white transform translate-x-1/4 -translate-y-1/4 rounded-full shadow-sm border-2 ${useLightText ? 'bg-blue-500 border-transparent' : 'bg-blue-600 border-white'}`}>
                  {totalItems}
                </span>
              )}
            </Link>

            <Button size="sm" className={`rounded-full px-5 transition-all duration-300 ${useLightText ? 'bg-white text-blue-900 hover:bg-gray-100 shadow-[0_0_15px_rgba(255,255,255,0.3)]' : 'bg-gray-900 hover:bg-blue-600 text-white shadow-lg hover:shadow-blue-500/25'}`} asChild>
              <Link to="/book-appointment">
                <CalendarDays className="w-4 h-4 mr-2" />
                Book Now
              </Link>
            </Button>
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-3 md:hidden">
            <Link to="/cart" className={`relative p-2 ${useLightText ? 'text-white' : 'text-gray-700'}`}>
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className={`absolute top-0 right-0 inline-flex items-center justify-center min-w-[18px] h-[18px] text-[10px] font-bold text-white transform translate-x-1/4 -translate-y-1/4 rounded-full border-2 ${useLightText ? 'bg-blue-500 border-transparent' : 'bg-blue-600 border-white'}`}>
                  {totalItems}
                </span>
              )}
            </Link>
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className={`rounded-full ${useLightText ? 'text-white hover:bg-white/20' : ''}`}>
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[350px]">
                <SheetHeader className="text-left mb-6">
                  <SheetTitle className="font-bold text-xl">Menu</SheetTitle>
                  <SheetDescription>Navigate our store</SheetDescription>
                </SheetHeader>
                <nav className="flex flex-col space-y-2">
                  {navLinks.map(link => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`p-3 rounded-xl font-medium transition-all ${
                        isActive(link.to)
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                  
                  <div className="h-px bg-gray-100 my-4"></div>
                  
                  {isAuthenticated && customer ? (
                    <>
                      <div className="px-3 py-2 mt-2 font-bold text-gray-900 border-t border-gray-100">
                        {customer.name}
                      </div>
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 p-3 rounded-xl font-medium text-gray-600 hover:bg-gray-50 transition-all"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        to="/track-order"
                        className="flex items-center gap-3 p-3 rounded-xl font-medium text-gray-600 hover:bg-gray-50 transition-all"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Order History
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setMobileMenuOpen(false);
                        }}
                        className="flex items-center gap-3 p-3 rounded-xl font-medium text-red-600 hover:bg-red-50 transition-all text-left w-full"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <Link
                      to="/login"
                      className="flex items-center gap-3 p-3 rounded-xl font-medium text-gray-600 hover:bg-gray-50 transition-all"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User className="w-5 h-5" />
                      Login
                    </Link>
                  )}
                  
                  <Button className="w-full mt-4 rounded-xl bg-gray-900 h-12" asChild onClick={() => setMobileMenuOpen(false)}>
                    <Link to="/book-appointment">
                      <CalendarDays className="w-5 h-5 mr-2" />
                      Book Appointment
                    </Link>
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}