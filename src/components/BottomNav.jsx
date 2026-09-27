import { Link, useLocation } from 'react-router-dom';
import { Home, Settings, History } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', label: 'Tavoli', icon: Home, match: (path) => path === '/' || path.startsWith('/table') },
  { to: '/history', label: 'Storico', icon: History, match: (path) => path === '/history' },
  { to: '/config', label: 'Config', icon: Settings, match: (path) => path === '/config' },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 z-40"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="grid grid-cols-3">
        {NAV_ITEMS.map(({ to, label, icon: Icon, match }) => {
          const isActive = match(location.pathname);
          return (
            <Link
              key={to}
              to={to}
              className={`flex flex-col items-center justify-center gap-1 py-2.5 min-h-[56px] text-xs font-medium transition-colors ${
                isActive ? 'text-indigo-600' : 'text-gray-500'
              }`}
            >
              <Icon className="h-6 w-6" />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
