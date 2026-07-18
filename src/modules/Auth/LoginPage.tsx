import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router';
import { useAuth } from '../../app/context/AuthContext';
import { useCustomerAuth } from '../../app/context/CustomerAuthContext';
import { Button } from '../../app/components/ui/button';
import { Input } from '../../app/components/ui/input';
import logoImage from '../../assets/logo.png';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [otpValues, setOtpValues] = useState<string[]>(Array(6).fill(''));
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { loginWithUserData } = useAuth();
  const { sendOtp: sendCustomerOtp, loginWithCustomerData } = useCustomerAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const from = (location.state as any)?.from?.pathname;

  useEffect(() => {
    if (otpSent) {
      setTimeout(() => {
        otpRefs.current[0]?.focus();
      }, 100);
    }
  }, [otpSent]);

  const handleOtpChange = (index: number, value: string) => {
    // Only accept numeric inputs
    if (value && !/^\d+$/.test(value)) return;

    const newOtpValues = [...otpValues];
    newOtpValues[index] = value.slice(-1);
    setOtpValues(newOtpValues);

    // Auto-focus next input if a digit was entered
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otpValues[index] && index > 0) {
        // Focus the previous input and clear it
        otpRefs.current[index - 1]?.focus();
        const newOtpValues = [...otpValues];
        newOtpValues[index - 1] = '';
        setOtpValues(newOtpValues);
      } else {
        const newOtpValues = [...otpValues];
        newOtpValues[index] = '';
        setOtpValues(newOtpValues);
      }
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (!/^\d{6}$/.test(pastedData)) return;

    const digits = pastedData.split('');
    setOtpValues(digits);
    otpRefs.current[5]?.focus();
  };

  const handleSendOtp = async () => {
    if (!phone) {
      setError('Please enter a phone number.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const success = await sendCustomerOtp(phone);
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

    if (!otpSent) {
      await handleSendOtp();
      return;
    }

    const otpCode = otpValues.join('');
    if (otpCode.length !== 6) {
      setError('Please enter a 6-digit OTP.');
      return;
    }

    setLoading(true);
    try {
      // Mock OTP validation logic
      if (otpCode === '123456' || otpCode === '1234') {
        let mockRole: 'customer' | 'staff' | 'admin' = 'customer';
        if (phone.includes('admin') || phone === '9999999999') {
          mockRole = 'admin';
        } else if (phone.includes('staff') || phone === '8888888888') {
          mockRole = 'staff';
        }

        if (mockRole === 'customer') {
          const mockCustomer = {
            id: 'mock-customer-id',
            name: 'Customer User',
            email: `${phone}@raghumobile.com`,
            phone: phone,
            address: '',
            gender: 'Other',
          };
          loginWithCustomerData(mockCustomer, `mock_token_${Date.now()}`);
          navigate('/', { replace: true });
        } else {
          const mockUser = {
            id: `mock-${mockRole}-id`,
            name: mockRole === 'admin' ? 'Admin User' : 'Staff User',
            email: `${phone}@raghumobile.com`,
            role: mockRole as 'admin' | 'staff',
          };
          loginWithUserData(mockUser, `mock_token_${Date.now()}`);
          navigate(mockRole === 'staff' ? '/staff' : '/admin', { replace: true });
        }
        return;
      }

      // Real backend request
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
      const res = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp_code: otpCode }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.access_token && data.user) {
          const backendUser = data.user;
          // Check role: 0 = customer, 1 = admin, 2 = staff
          if (backendUser.role === 1 || backendUser.role === 2) {
            const mappedRole = backendUser.role === 1 ? 'admin' : 'staff';
            const mappedUser = {
              id: backendUser._id || backendUser.id || 'staff-id',
              name: backendUser.name || (mappedRole === 'admin' ? 'Admin User' : 'Staff User'),
              email: backendUser.email || `${phone}@raghumobile.com`,
              role: mappedRole as 'admin' | 'staff',
            };
            loginWithUserData(mappedUser, data.access_token);
            if (from) {
              navigate(from, { replace: true });
            } else {
              navigate(mappedRole === 'staff' ? '/staff' : '/admin', { replace: true });
            }
          } else {
            // Customer
            const mappedCustomer = {
              id: backendUser._id || backendUser.id || 'customer-id',
              name: backendUser.name || 'Customer User',
              email: backendUser.email || '',
              phone: backendUser.phone || phone,
              address: backendUser.full_address || '',
              gender: backendUser.gender || 'Other',
            };
            loginWithCustomerData(mappedCustomer, data.access_token);
            if (from) {
              navigate(from, { replace: true });
            } else {
              navigate('/', { replace: true });
            }
          }
        } else {
          setError('Invalid OTP code or user session not generated.');
        }
      } else {
        const errorData = await res.json();
        if (res.status === 404) {
          setError('User not registered. Redirecting to sign up...');
          setTimeout(() => {
            navigate('/signup');
          }, 1500);
          return;
        }
        setError(errorData.detail || 'OTP verification failed.');
      }
    } catch (err) {
      console.error('OTP login failed:', err);
      setError('An error occurred during verification. Please try again.');
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

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-sm text-red-500 bg-red-50 p-3 rounded-lg text-center font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Phone Number</label>
            <Input
              type="tel"
              placeholder="Phone number"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              required
              disabled={otpSent}
              className="bg-gray-50 border-gray-100 text-gray-900 placeholder:text-gray-400 h-[50px] rounded-xl focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:ring-offset-0 px-4 transition-all"
            />
          </div>

          {otpSent && (
            <div className="animate-fade-in">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 text-center">
                Enter 6-Digit OTP
              </label>
              <div className="flex justify-between gap-2 my-2">
                {otpValues.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={el => (otpRefs.current[idx] = el)}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(idx, e.target.value)}
                    onKeyDown={e => handleOtpKeyDown(idx, e)}
                    onPaste={idx === 0 ? handleOtpPaste : undefined}
                    className="w-12 h-14 text-center text-xl font-bold border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none bg-gray-50 text-gray-900 transition-all shadow-sm"
                  />
                ))}
              </div>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-[50px] bg-[#1a56db] hover:bg-blue-700 text-white rounded-xl font-medium text-[15px] transition-all shadow-md hover:shadow-lg mt-4 active:scale-[0.98]"
          >
            {loading ? 'Please wait...' : (otpSent ? 'Verify & Login' : 'Send OTP')}
          </Button>

          <div className="relative py-4">
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
