import { Link } from 'react-router';
import { Button } from '../../app/components/ui/button';
import { Card, CardContent } from '../../app/components/ui/card';
import { Badge } from '../../app/components/ui/badge';
import { ArrowRight, CheckCircle2, Users, Target, Shield, Heart, Award, Clock, MapPin, Phone, Smartphone, CreditCard, CheckCircle, Star } from 'lucide-react';

export default function AboutPage() {
  const milestones = [
    { year: '2000', event: 'Founded Raghu Mobile Wholesale in Erode, Tamil Nadu.' },
    { year: '2017', event: 'Became authorised reseller for Samsung & Vivo' },
    { year: '2019', event: 'Expanded to full accessories range' },
    { year: '2021', event: 'Added iPhone & Apple accessories lineup' },
    { year: '2023', event: 'Launched in-store repair & service centre' },
    { year: '2025', event: 'Serving 10,000+ happy customers in Tamil Nadu' },
  ];

  const values = [
    {
      icon: Shield,
      title: 'Genuine Products',
      desc: 'Every product we sell is 100% authentic, sourced directly from official brand distributors.',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      icon: Award,
      title: 'Expert Advice',
      desc: 'Our trained staff helps you pick the right phone for your budget and lifestyle.',
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      icon: Users,
      title: 'Customer First',
      desc: 'Over 10,000 satisfied customers trust us for their mobile needs year after year.',
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      icon: Clock,
      title: 'After-sales Support',
      desc: 'We are always here — warranty support, repairs, and service beyond the sale.',
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
  ];

  const brands = ['Apple', 'Samsung', 'OnePlus', 'Vivo', 'OPPO', 'Realme', 'Motorola', 'Xiaomi'];

  const team = [
    { name: 'Raghu', role: 'Founder & Owner', exp: '11+ years experience' },
  ];

  const services = [
    {
      icon: Smartphone,
      title: 'Phone Sales',
      desc: 'Second hand mobiles from all brands at wholesale and retail prices. Exchange & upgrade welcome.',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      icon: CreditCard,
      title: 'Easy EMI Plans',
      desc: 'Flexible installment options with 0% interest on select models.',
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      icon: Shield,
      title: 'Quality Checked',
      desc: 'Every phone goes through a rigorous 40-point quality check.',
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
    },
    {
      icon: CheckCircle,
      title: 'Customer Support',
      desc: 'Expert guidance on selection and reliable post-purchase assistance.',
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
  ];

  const testimonials = [
    {
      name: 'Suresh M.',
      location: 'Erode',
      rating: 5,
      text: 'Best mobile shop in Erode! Got my iPhone 15 at a great price with all accessories. Very helpful staff.',
    },
    {
      name: 'Kavitha R.',
      location: 'Bhavani',
      rating: 5,
      text: 'My Samsung screen was repaired in just 2 hours. Very professional team and reasonable rates.',
    },
    {
      name: 'Arun K.',
      location: 'Gobichettipalayam',
      rating: 5,
      text: 'Bought a OnePlus phone on EMI with zero interest. The staff explained everything clearly. Highly recommend!',
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4 bg-white/20 text-white border-white/30 hover:bg-white/30">Est. 2000</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About Raghu Mobile Wholesale</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
            Erode's most trusted wholesale and retail mobile phone shop — bringing you second hand mobiles for all brands, genuine products, honest prices,
            and expert guidance since 2000.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/book-appointment">Book an Appointment</Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-blue-700" asChild>
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: '11+', label: 'Years in Business' },
              { value: '10,000+', label: 'Happy Customers' },
              { value: '8+', label: 'Brand Partners' },
              { value: '500+', label: 'Products Available' },
            ].map((stat, i) => (
              <div key={i}>
                <p className="text-4xl font-bold text-blue-600 mb-1">{stat.value}</p>
                <p className="text-gray-600 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-3 bg-blue-100 text-blue-700 hover:bg-blue-100">Our Story</Badge>
              <h2 className="text-3xl font-bold mb-6">From a Small Shop to Erode's #1 Mobile Destination</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Raghu Mobile Wholesale was founded in 2000 by Raghu Dharmalingam in the heart of Erode Fort with a simple
                mission — to make quality second hand smartphones accessible to everyone in the region with honest pricing
                and no hidden costs.
              </p>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Over the years, we have grown from a single-room shop to a fully-stocked mobile destination
                spanning multiple floors, carrying second hand mobiles from Apple, Samsung, OnePlus, Vivo and more.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Today, we are proud to be the go-to mobile shop for thousands of families across Erode and
                surrounding districts — offering not just phones, but a complete mobile experience including
                accessories, repairs, and EMI plans.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {milestones.map((m, i) => (
                <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <p className="text-2xl font-bold text-blue-600">{m.year}</p>
                  <p className="text-sm text-gray-600 mt-1">{m.event}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-3 bg-blue-100 text-blue-700 hover:bg-blue-100">Why Choose Us</Badge>
            <h2 className="text-3xl font-bold">What Makes Us Different</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <Card key={i} className="hover:shadow-lg transition-shadow border-none shadow-sm">
                <CardContent className="p-6 text-center">
                  <div className={`inline-flex items-center justify-center w-14 h-14 ${v.bg} ${v.color} rounded-2xl mb-4`}>
                    <v.icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{v.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{v.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <Badge className="mb-3 bg-blue-100 text-blue-700 hover:bg-blue-100">Official Partners</Badge>
            <h2 className="text-3xl font-bold">Brands We Carry</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {brands.map((brand, i) => (
              <div
                key={i}
                className="bg-white px-6 py-3 rounded-full shadow-sm border border-gray-200 font-semibold text-gray-700 hover:border-blue-400 hover:text-blue-600 transition-colors"
              >
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-3 bg-blue-100 text-blue-700 hover:bg-blue-100">What We Do</Badge>
            <h2 className="text-3xl font-bold mb-3">Our Services</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              From purchasing your dream phone to keeping it in perfect condition — we're your
              one-stop mobile destination in Erode.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-all hover:-translate-y-1 border-none shadow-sm">
                <CardContent className="p-6 text-center">
                  <div className={`inline-flex items-center justify-center w-14 h-14 ${service.bg} ${service.color} rounded-2xl mb-4`}>
                    <service.icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{service.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{service.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-3 bg-blue-100 text-blue-700 hover:bg-blue-100">Happy Customers</Badge>
            <h2 className="text-3xl font-bold">What Our Customers Say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <Card key={i} className="hover:shadow-lg transition-shadow border-none shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 leading-relaxed">"{t.text}"</p>
                  <div>
                    <p className="font-semibold">{t.name}</p>
                    <p className="text-sm text-gray-500">{t.location}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-3 bg-blue-100 text-blue-700 hover:bg-blue-100">Our Team</Badge>
            <h2 className="text-3xl font-bold">Meet the People Behind Raghu Mobile Wholesale</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {team.map((member, i) => (
              <Card key={i} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl font-bold">{member.name[0]}</span>
                  </div>
                  <h3 className="font-bold text-lg">{member.name}</h3>
                  <p className="text-blue-600 text-sm font-medium">{member.role}</p>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-gray-600">{member.exp}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Come Visit Us in Erode</h2>
          <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
            We'd love to meet you in person! Drop by our store or book an appointment for a personalised experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
            <div className="flex items-center gap-2 text-blue-100">
              <MapPin className="w-5 h-5" />
              <span>2nd Floor, RR Complex, Erode Fort, Erode, TN 638001</span>
            </div>
            <div className="flex items-center gap-2 text-blue-100">
              <Phone className="w-5 h-5" />
              <span>+91 9698237458 / +91 8608237458</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/book-appointment">Book an Appointment</Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-blue-700" asChild>
              <Link to="/contact">Get Directions</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
