
import React from 'react';
import Navbar from './Navbar';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, requireAuth = false }) => {
  const { currentUser, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-t-asu-maroon border-r-asu-gold border-b-asu-navy border-l-asu-teal rounded-full animate-spin"></div>
      </div>
    );
  }

  if (requireAuth && !currentUser) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <footer className="py-6 text-center bg-white border-t">
        <p className="text-sm text-gray-600">
          © {new Date().getFullYear()} ASU-ccessful Match. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Layout;
