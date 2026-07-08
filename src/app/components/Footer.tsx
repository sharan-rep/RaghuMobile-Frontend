import { Link } from 'react-router';
import { Facebook, Instagram, Mail, Phone, MapPin, CalendarDays, ArrowRight } from 'lucide-react';
import { Separator } from './ui/separator';
import { Button } from './ui/button';

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 mt-auto pt-20 pb-8 relative overflow-hidden">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600"></div>

      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">

          {/* About / Branding */}
          <div className="lg:col-span-1">
            <h3 className="text-white font-bold text-2xl tracking-tight mb-6">
              Raghu Mobile <br /><span className="text-blue-500">Wholesale</span>
            </h3>
            <p className="text-sm text-slate-400 mb-8 leading-relaxed font-light">
              Your premium destination for high-quality, verified second-hand mobiles and accessories in Erode.
              Delivering excellence and trust since 2000.
            </p>
            <div className="flex gap-4">
              <a href="#" aria-label="Facebook" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-[0_4px_14px_0_rgba(0,0,0,0.39)] hover:shadow-[0_4px_14px_0_rgba(37,99,235,0.39)]">
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/raghu__mobiles__?igsh=NTFycm1kbmcyczFt"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all duration-300 shadow-[0_4px_14px_0_rgba(0,0,0,0.39)] hover:shadow-[0_4px_14px_0_rgba(219,39,119,0.39)]"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Explore</h3>
            <ul className="space-y-4 text-sm font-medium">
              <li>
                <Link to="/" className="text-slate-400 hover:text-blue-400 hover:translate-x-1 transition-all flex items-center gap-2">
                  <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 transition-all" /> Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-slate-400 hover:text-blue-400 hover:translate-x-1 transition-all flex items-center gap-2">
                  <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 transition-all" /> Shop Products
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-400 hover:text-blue-400 hover:translate-x-1 transition-all flex items-center gap-2">
                  <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 transition-all" /> About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-400 hover:text-blue-400 hover:translate-x-1 transition-all flex items-center gap-2">
                  <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 transition-all" /> Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-1">
            <h3 className="text-white font-semibold text-lg mb-6">Contact Us</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center flex-shrink-0 text-blue-500">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-slate-400 mt-1 leading-relaxed">2nd Floor, RR Complex, Erode Fort, Erode, Tamil Nadu 638001</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center flex-shrink-0 text-blue-500">
                  <Phone className="w-4 h-4" />
                </div>
                <a href="tel:+919698237458" className="text-slate-400 hover:text-blue-400 transition-colors">+91 96982 37458</a>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center flex-shrink-0 text-blue-500">
                  <Mail className="w-4 h-4" />
                </div>
                <a href="mailto:raghu25dharmalingam@gmail.com" className="text-slate-400 hover:text-blue-400 transition-colors break-all">raghu25dharmalingam@gmail.com</a>
              </li>
            </ul>
          </div>

          {/* Newsletter / Action */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Store Experience</h3>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed font-light">
              Want to see our devices in person? Book an appointment for a personalized viewing experience.
            </p>
            <Button className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 text-white h-12 shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all" asChild>
              <Link to="/book-appointment">
                <CalendarDays className="w-4 h-4 mr-2" />
                Book Appointment
              </Link>
            </Button>

            <div className="mt-8 text-xs font-medium border border-slate-800 rounded-xl p-4 bg-slate-900/50">
              <p className="text-slate-500 mb-2">Store Hours:</p>
              <div className="flex justify-between items-center mb-1">
                <span className="text-slate-400">Mon - Sat</span>
                <span className="text-white">10:00 AM - 9:00 PM</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Sunday</span>
                <span className="text-white">10:00 AM - 6:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-slate-800 mb-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500 font-medium">
          <p>© {new Date().getFullYear()} Raghu Mobile Wholesale. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-blue-400 transition-colors">Terms of Service</Link>
            <span className="text-gray-400">
              Designed by <span className="font-medium text-white">Sharan Byju</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}