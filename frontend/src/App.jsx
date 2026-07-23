import React, { useEffect } from 'react';
import { Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AdminProvider } from './context/AdminContext';
import { Topbar } from './components/Topbar';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { Services } from './pages/Services';
import { ServiceDetail } from './pages/ServiceDetail';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Profile } from './pages/Profile';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { VerifyEmail } from './pages/VerifyEmail';
import { Admin } from './pages/Admin';

// Scroll to top helper on route change
const ScrollToTop = ({ children }) => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return children;
};

// Layout Shell for public pages
const Layout = () => {
  return (
    <div className="site-wrapper">
      <Topbar />
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <ScrollToTop>
          <Routes>
            {/* Public Layout Routes */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Services />} />
              <Route path="services" element={<Services />} />
              <Route path="services/:slug" element={<ServiceDetail />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              <Route path="profile" element={<Profile />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
              <Route path="reset-password" element={<ResetPassword />} />
              <Route path="verify-email" element={<VerifyEmail />} />
            </Route>

            {/* Admin Portal Route (Standalone Layout) */}
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </ScrollToTop>
      </AdminProvider>
    </AuthProvider>
  );
}

export default App;
