import { Outlet, Link } from 'react-router-dom';
import { Home, Settings, History, Utensils } from 'lucide-react';
import BottomNav from './BottomNav';
import RippleEffect from './RippleEffect';

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Utensils className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Tabbly</span>
            </div>
            <div className="hidden lg:flex items-center space-x-4">
              <Link
                to="/"
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
              >
                <Home className="h-5 w-5 mr-1" />
                Tavoli
              </Link>
              <Link
                to="/history"
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
              >
                <History className="h-5 w-5 mr-1" />
                Storico
              </Link>
              <Link
                to="/config"
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
              >
                <Settings className="h-5 w-5 mr-1" />
                Config
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 pb-24 lg:pb-8">
        <Outlet />
      </main>
      <BottomNav />
      <RippleEffect />
    </div>
  );
}
