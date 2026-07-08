import { createBrowserRouter } from 'react-router';
import RootLayout from './Layouts/RootLayout';
import AdminLayout from './Layouts/AdminLayout';
import StaffLayout from './Layouts/StaffLayout';

import HomePage from '../modules/Home/HomePage';
import AboutPage from '../modules/Home/AboutPage';
import ContactPage from '../modules/Home/ContactPage';
import BookAppointmentPage from '../modules/Staff/BookAppointmentPage';
import ProductsPage from '../modules/Products/ProductsPage';
import ProductDetailPage from '../modules/Products/ProductDetailPage';
import CartPage from '../modules/Orders/CartPage';
import WishlistPage from '../modules/Orders/WishlistPage';
import OrderTrackingPage from '../modules/Orders/OrderTrackingPage';
import LoginPage from '../modules/Auth/LoginPage';
import SignupPage from '../modules/Auth/SignupPage';
import CheckoutPage from '../modules/Orders/CheckoutPage';

import DashboardPage from '../modules/Admin/DashboardPage';
import ProductManagementPage from '../modules/Products/ProductManagementPage';
import AddProductPage from '../modules/Products/AddProductPage';
import OrderManagementPage from '../modules/Orders/OrderManagementPage';
import StaffManagementPage from '../modules/Admin/StaffManagementPage';
import StaffAttendancePage from '../modules/Staff/StaffAttendancePage';
import LeaveManagementPage from '../modules/Staff/LeaveManagementPage';
import ApprovalManagementPage from '../modules/Staff/ApprovalManagementPage';
import SalesReportsPage from '../modules/Admin/SalesReportsPage';
import CustomerManagementPage from '../modules/Admin/CustomerManagementPage';
import POSPage from '../modules/POS/POSPage';
import PaymentReportsPage from '../modules/Admin/PaymentReportsPage';

export const router = createBrowserRouter(
  [
    {
      path: '/',
      Component: RootLayout,
      children: [
        { index: true, Component: HomePage },
        { path: 'about', Component: AboutPage },
        { path: 'contact', Component: ContactPage },
        { path: 'book-appointment', Component: BookAppointmentPage },
        { path: 'products', Component: ProductsPage },
        { path: 'products/:id', Component: ProductDetailPage },
        { path: 'cart', Component: CartPage },
        { path: 'wishlist', Component: WishlistPage },
        { path: 'track-order', Component: OrderTrackingPage },
        { path: 'checkout', Component: CheckoutPage },
      ],
    },
    { path: '/login', Component: LoginPage },
    { path: '/signup', Component: SignupPage },
    {
      path: '/admin',
      Component: AdminLayout,
      children: [
        { index: true, Component: DashboardPage },
        { path: 'products', Component: ProductManagementPage },
        { path: 'products/add', Component: AddProductPage },
        { path: 'customers', Component: CustomerManagementPage },
        { path: 'orders', Component: OrderManagementPage },
        { path: 'analytics', Component: SalesReportsPage },
        { path: 'payments', Component: PaymentReportsPage },
        { path: 'staff', Component: StaffManagementPage },
        { path: 'staff/attendance', Component: StaffAttendancePage },
        { path: 'staff/leave', Component: LeaveManagementPage },
        { path: 'approvals', Component: ApprovalManagementPage },
      ],
    },
    {
      path: '/admin/pos',
      Component: POSPage,
    },
    {
      path: '/staff',
      Component: StaffLayout,
      children: [
        { index: true, Component: DashboardPage },
        { path: 'attendance', Component: StaffAttendancePage },
        { path: 'leave', Component: LeaveManagementPage },
        { path: 'orders', Component: OrderManagementPage },
        { path: 'products', Component: ProductManagementPage },
      ],
    },
    {
      path: '/staff/pos',
      Component: POSPage,
    },
  ],
  {
    basename:
      import.meta.env.BASE_URL && import.meta.env.BASE_URL !== '/'
        ? import.meta.env.BASE_URL.replace(/\/$/, '')
        : '/',
  }
);