import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router';
import { useAuth, UserRole } from '../../app/context/AuthContext';
import { useCustomerAuth } from '../../app/context/CustomerAuthContext';
import { Button } from '../../app/components/ui/button';
import { Input } from '../../app/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';
import logoImage from '../../assets/logo.png';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'customer' | 'staff' | 'admin'>('customer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, sendOtp: sendStaffOtp, verifyOtp: verifyStaffOtp } = useAuth();
  const { sendOtp: sendCustomerOtp, verifyOtp: verifyCustomerOtp, login: mockCustomerLogin } = useCustomerAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname;

  const quickLogin = (role: 'customer' | 'staff' | 'admin') => {
    setSelectedRole(role);
    setOtpSent(false);
    setError('');

    if (role === 'admin') {
      setEmail('admin@raghumobile.com');
      setPassword('admin123');
    } else if (role === 'staff') {
      setPhone('');
      setOtpCode('');
    } else {
      setPhone('');
      setOtpCode('');
    }
  };

  const handleSendOtp = async () => {
    if (!phone) {
      setError('Please enter a phone number.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const success = selectedRole === 'staff'
        ? await sendStaffOtp(phone)
        : await sendCustomerOtp(phone);

      if (success) {
        setOtpSent(true);
      } else {
        setError('Failed to send OTP. Please try again.');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let success = false;
      if (selectedRole === 'customer' || selectedRole === 'staff') {
        if (!otpSent) {
          await handleSendOtp();
          return;
        } else {
          // If phone is the mock phone and otp is exactly 1234, or we call the real verify
          success = selectedRole === 'staff'
            ? await verifyStaffOtp(phone, otpCode, 'staff')
            : await verifyCustomerOtp(phone, otpCode);
        }
      } else {
        success = await login(email, password, selectedRole as UserRole);
      }

      if (success) {
        if (from) {
          navigate(from, { replace: true });
        } else {
          navigate(selectedRole === 'customer' ? '/' : (selectedRole === 'staff' ? '/staff' : '/admin'), { replace: true });
        }
      } else {
        setError('Invalid credentials.');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50 px-4 font-sans">

      {/* Login Card */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 sm:p-8 w-full max-w-[400px] relative overflow-hidden">
        {/* Subtle top gradient accent */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

        <div className="text-center mb-6">
          <div className="flex flex-col items-center justify-center gap-2 mb-4">
            <div className="bg-gradient-to-tr from-blue-50 to-indigo-100 p-2 rounded-xl shadow-sm border border-blue-100/50">
              <img src={logoImage} alt="Logo" className="w-8 h-8 object-contain drop-shadow-sm" />
            </div>
            <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 tracking-tight">Raghu Mobile Wholesale</h1>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h2>
          <p className="text-gray-500 text-sm">Sign in to your shopping account</p>
        </div>

        {/* Role Tabs */}
        <div className="flex p-1 bg-gray-100 rounded-xl mb-6">
          {(['customer', 'staff', 'admin'] as const).map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => quickLogin(role)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all capitalize ${selectedRole === role
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              {role}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-sm text-red-500 bg-red-50 p-3 rounded-lg text-center">
              {error}
            </div>
          )}

          {selectedRole === 'customer' || selectedRole === 'staff' ? (
            <>
              <div>
                <Input
                  type="tel"
                  placeholder="Phone number"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  required
                  disabled={otpSent}
                  className="bg-gray-50 border-gray-100 text-gray-900 placeholder:text-gray-400 h-[50px] rounded-xl focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:ring-offset-0 px-4"
                />
              </div>

              {otpSent && (
                <div>
                  <Input
                    type="text"
                    placeholder="Enter OTP"
                    value={otpCode}
                    onChange={e => setOtpCode(e.target.value)}
                    required
                    className="bg-gray-50 border-gray-100 text-gray-900 placeholder:text-gray-400 h-[50px] rounded-xl focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:ring-offset-0 px-4"
                  />
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-[50px] bg-[#1a56db] hover:bg-blue-700 text-white rounded-xl font-medium text-[15px] transition-colors"
              >
                {loading ? 'Please wait...' : (otpSent ? 'Verify & Login' : 'Send OTP')}
              </Button>
            </>
          ) : (
            <>
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

              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="bg-gray-50 border-gray-100 text-gray-900 placeholder:text-gray-400 h-[50px] rounded-xl pr-12 focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:ring-offset-0 px-4"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <div className="flex justify-end pt-1 pb-2">
                <Link to="#" className="text-[13px] text-blue-600 hover:text-blue-700 font-medium">
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-[50px] bg-[#1a56db] hover:bg-blue-700 text-white rounded-xl font-medium text-[15px] transition-colors"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>
            </>
          )}

          <div className="relative py-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-4 text-gray-400">or</span>
            </div>
          </div>

          <div className="text-center text-[15px] text-gray-500">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
