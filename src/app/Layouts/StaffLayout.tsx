import { Outlet, Link, useLocation } from 'react-router';
import { ScrollToTop } from '../components/ScrollToTop';
import logoImage from '../../assets/logo.png';
import { LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '../components/ui/dropdown-menu';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

export default function StaffLayout() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only allow staff users
    if (!user || user.role !== 'staff') {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user) return null;
  
  // Staff specific navigation items
  const navItems = [
    { label: 'Dashboard', path: '/staff' },
    { label: 'Mark Attendance', path: '/staff/attendance' },
    { label: 'Manage Leave', path: '/staff/leave' },
    { label: 'Order List', path: '/staff/orders' },
    { label: 'Manage Products', path: '/staff/products' },
  ];

  const isActive = (path: string) => {
    if (path === '/staff') {
      return location.pathname === '/staff';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <ScrollToTop />
      
      {/* Top Navigation Bar with Gradient */}
      <header className="bg-gradient-to-r from-[#1B543E] via-[#296D4E] to-[#1E3B2E] text-white w-full z-10 sticky top-0 shadow-md">
        <div className="px-4 w-full">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo area */}
            <Link to="/staff" className="flex items-center gap-3">
              <div className="bg-white p-1 rounded-lg w-10 h-10 flex items-center justify-center">
                <img src={logoImage} alt="Logo" className="w-8 h-8 object-contain" />
              </div>
              <div className="flex flex-col justify-center">
                <span className="font-bold text-lg leading-tight">Raghu Mobile <span className="text-green-400">Staff</span></span>
                <span className="text-[10px] text-gray-400 flex items-center italic">⚡ Erode's Trusted Store</span>
              </div>
            </Link>

            {/* Nav Links */}
            <nav className="hidden lg:flex space-x-2 h-full flex-1 justify-center">
              {navItems.map((item) => {
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center px-4 h-full text-sm font-medium transition-colors border-b-[3px] ${
                      active
                        ? 'border-green-400 text-green-300 bg-white/5'
                        : 'border-transparent text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            {/* Profile */}
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger className="outline-none">
                  <div className="flex items-center gap-2 cursor-pointer hover:bg-white/5 p-2 rounded-md transition-colors">
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center font-bold text-white shadow-sm">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="text-sm font-medium hidden sm:block">{user.name}</span>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 mt-1">
                  <DropdownMenuItem asChild>
                    <button onClick={() => { logout(); navigate('/'); }} className="flex items-center w-full cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 font-medium">
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full bg-[#f4f7f6]">
        <Outlet />
      </main>
    </div>
  );
}
