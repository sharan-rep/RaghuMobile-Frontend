import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useCustomerAuth } from '../../app/context/CustomerAuthContext';
import { Button } from '../../app/components/ui/button';
import { Input } from '../../app/components/ui/input';
import { toast } from 'sonner';
import logoImage from '../../assets/logo.png';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useCustomerAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const success = await register?.({ name, email, phone, full_address: fullAddress });
      // For mock UI, we will just assume success
      toast.success('Registration successful! Please login.');
      navigate('/login', { replace: true });
    } catch {
      toast.error('An error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f4f7fb] px-4 font-sans">
      {/* Top Logo */}
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-white p-2 rounded-full shadow-sm">
          <img src={logoImage} alt="Logo" className="w-8 h-8 object-contain" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Raghu Mobile Wholesale</h1>
      </div>

      {/* Signup Card */}
      <div className="bg-white rounded-[24px] shadow-sm p-8 sm:p-10 w-full max-w-[440px]">
        <div className="text-center mb-8">
          <h2 className="text-[28px] font-bold text-gray-900 mb-2">Create an account</h2>
          <p className="text-gray-500 text-sm">Join us for the best shopping experience</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="bg-gray-50 border-gray-100 text-gray-900 placeholder:text-gray-400 h-[50px] rounded-xl focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:ring-offset-0 px-4"
            />
          </div>

          <div>
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="bg-gray-50 border-gray-100 text-gray-900 placeholder:text-gray-400 h-[50px] rounded-xl focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:ring-offset-0 px-4"
            />
          </div>

          <div>
            <Input
              type="tel"
              placeholder="Phone number"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              required
              className="bg-gray-50 border-gray-100 text-gray-900 placeholder:text-gray-400 h-[50px] rounded-xl focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:ring-offset-0 px-4"
            />
          </div>

          <div>
            <textarea
              placeholder="Full Address"
              value={fullAddress}
              onChange={e => setFullAddress(e.target.value)}
              required
              rows={3}
              className="bg-gray-50 border-gray-100 text-gray-900 placeholder:text-gray-400 rounded-xl focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:ring-offset-0 p-4 w-full"
            />
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full h-[50px] bg-[#1a56db] hover:bg-blue-700 text-white rounded-xl font-medium text-[15px] transition-colors mt-6"
          >
            {loading ? 'Registering...' : 'Register'}
          </Button>

          <div className="text-center text-[13px] text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
