import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Button } from '../../app/components/ui/button';
import { Input } from '../../app/components/ui/input';
import { Label } from '../../app/components/ui/label';
import { Card, CardContent } from '../../app/components/ui/card';
import { Badge } from '../../app/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../app/components/ui/select';
import { toast } from 'sonner';
import {
  CalendarDays,
  Phone,
  Mail,
  User,
  MessageSquare,
  CheckCircle,
  Wrench,
  ShoppingBag,
  Headphones,
  HelpCircle,
} from 'lucide-react';

export default function BookAppointmentPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    serviceType: '',
    preferredDate: '',
    message: '',
  });

  const services = [
    { value: 'Phone Purchase', label: 'Phone Purchase', icon: ShoppingBag },
    { value: 'Repair', label: 'Phone Repair', icon: Wrench },
    { value: 'Accessories', label: 'Accessories', icon: Headphones },
    { value: 'EMI Enquiry', label: 'EMI / Finance Enquiry', icon: CalendarDays },
    { value: 'Other', label: 'Other', icon: HelpCircle },
  ];

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.serviceType) {
      toast.error('Please select a service type.');
      return;
    }

    // Construct WhatsApp message
    const text = `*New Enquiry from Website*

*Name:* ${form.name}
*Phone:* ${form.phone}
*Email:* ${form.email || 'N/A'}
*Service:* ${form.serviceType}
*Preferred Date:* ${form.preferredDate || 'N/A'}
*Message:* ${form.message || 'N/A'}`;

    const messageText = encodeURIComponent(text);

    // Open WhatsApp
    window.open(`https://wa.me/919698237458?text=${messageText}`, '_blank');

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-16 bg-gray-50">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-10">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-3">Enquiry Submitted!</h2>
            <p className="text-gray-600 mb-6">
              Thank you, <strong>{form.name}</strong>! We've received your enquiry and our team will
              contact you at <strong>{form.phone}</strong> within 2 hours.
            </p>
            <div className="flex flex-col gap-3">
              <Button asChild>
                <Link to="/">Back to Home</Link>
              </Button>
              <Button variant="outline" onClick={() => { setSubmitted(false); setForm({ name: '', phone: '', email: '', serviceType: '', preferredDate: '', message: '' }); }}>
                Submit Another Enquiry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4 bg-white/20 text-white border-white/30 hover:bg-white/30">Free Consultation</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Book an Appointment</h1>
          <p className="text-blue-100 text-lg max-w-xl mx-auto">
            Tell us what you need and we'll get back to you within 2 hours. No commitment required.
          </p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Why Book */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Why Book With Us?</h2>
              {[
                { icon: CheckCircle, title: 'No-hassle Consultation', desc: 'Our experts guide you to the right product without any sales pressure.' },
                { icon: Phone, title: 'Quick Response', desc: 'We call you back within 24 hours of receiving your enquiry.' },
                { icon: CalendarDays, title: 'Flexible Timing', desc: 'Visit us at your preferred time — we work 7 days a week.' },
                { icon: ShoppingBag, title: 'EMI Options', desc: 'We help you find the best finance plan that suits your budget.' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}

              {/* Contact Info */}
              <div className="bg-blue-600 text-white rounded-xl p-5 mt-4">
                <h3 className="font-bold mb-3">Prefer to call directly?</h3>
                <a href="tel:+919698237458" className="flex items-center gap-2 text-blue-100 hover:text-white transition-colors">
                  <Phone className="w-5 h-5" />
                  <span className="font-semibold text-lg">+91 9698237458 / +91 8608237458</span>
                </a>
                <p className="text-blue-200 text-sm mt-2">Mon – Sun, 9:00 AM – 8:00 PM</p>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-6">Send Us Your Enquiry</h2>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="flex items-center gap-2">
                          <User className="w-4 h-4 text-blue-600" />
                          Full Name *
                        </Label>
                        <Input
                          id="name"
                          placeholder="Your full name"
                          value={form.name}
                          onChange={e => handleChange('name', e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-blue-600" />
                          Phone Number *
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+91 XXXXX XXXXX"
                          value={form.phone}
                          onChange={e => handleChange('phone', e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-blue-600" />
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your@email.com"
                          value={form.email}
                          onChange={e => handleChange('email', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="preferredDate" className="flex items-center gap-2">
                          <CalendarDays className="w-4 h-4 text-blue-600" />
                          Preferred Visit Date
                        </Label>
                        <Input
                          id="preferredDate"
                          type="date"
                          value={form.preferredDate}
                          onChange={e => handleChange('preferredDate', e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4 text-blue-600" />
                        Service Type *
                      </Label>
                      <Select onValueChange={value => handleChange('serviceType', value)}>
                        <SelectTrigger id="serviceType">
                          <SelectValue placeholder="Select what you need..." />
                        </SelectTrigger>
                        <SelectContent>
                          {services.map(s => (
                            <SelectItem key={s.value} value={s.value}>
                              {s.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-blue-600" />
                        Message / Details
                      </Label>
                      <textarea
                        id="message"
                        rows={4}
                        placeholder="Tell us more — e.g. model you are interested in, your budget, issue description..."
                        value={form.message}
                        onChange={e => handleChange('message', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                      />
                    </div>

                    <Button type="submit" size="lg" className="w-full" disabled={loading}>
                      {loading ? 'Submitting...' : 'Submit Enquiry'}
                    </Button>

                    <p className="text-xs text-gray-500 text-center">
                      By submitting this form, you agree to be contacted by our team. We respect your privacy.
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
