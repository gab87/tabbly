import { NavLink, Outlet } from 'react-router-dom';
import { User, UtensilsCrossed } from 'lucide-react';

export default function Config() {
  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Configurazione</h1>
      <div className="flex flex-col lg:flex-row gap-6">
        <aside className="sticky top-16 z-30 lg:self-start flex flex-row lg:flex-col gap-2 lg:w-56 lg:flex-shrink-0 bg-gray-50 py-2 -my-2">
          <NavLink
            to="/config/profilo"
            className={({ isActive }) =>
              `h-11 flex items-center gap-2 px-4 rounded-lg text-sm font-medium transition-colors flex-1 lg:flex-initial justify-center lg:justify-start ${
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`
            }
          >
            <User className="h-5 w-5" />
            Profilo
          </NavLink>
          <NavLink
            to="/config"
            end
            className={({ isActive }) =>
              `h-11 flex items-center gap-2 px-4 rounded-lg text-sm font-medium transition-colors flex-1 lg:flex-initial justify-center lg:justify-start ${
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`
            }
          >
            <UtensilsCrossed className="h-5 w-5" />
            Menu
          </NavLink>
        </aside>
        <div className="flex-1 min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
