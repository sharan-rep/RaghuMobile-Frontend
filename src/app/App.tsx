import { RouterProvider } from 'react-router';
import { Toaster } from './components/ui/sonner';
import { router } from './routes';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { CustomerAuthProvider } from './context/CustomerAuthContext';
import { ProductProvider } from './context/ProductContext';
import { CartProvider } from './context/CartContext';
import { StaffProvider } from './context/StaffContext';
import { EnquiryProvider } from './context/EnquiryContext';

export default function App() {
  return (
    <AuthProvider>
      <CustomerAuthProvider>
        <ProductProvider>
          <CartProvider>
            <StaffProvider>
              <EnquiryProvider>
                <RouterProvider router={router} />
                <Toaster position="top-right" />
              </EnquiryProvider>
            </StaffProvider>
          </CartProvider>
        </ProductProvider>
      </CustomerAuthProvider>
    </AuthProvider>
  );
}