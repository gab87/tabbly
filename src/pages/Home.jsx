import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Utensils, Euro } from 'lucide-react';
import { useTables } from '../hooks/useTables';
import { useBusinessProfile } from '../hooks/useBusinessProfile';

export default function Home() {
  const navigate = useNavigate();
  const { tables, addTable, getTableTotal } = useTables();
  const { profile } = useBusinessProfile();
  const [showNewTable, setShowNewTable] = useState(false);
  const [tableName, setTableName] = useState('');

  const handleCreateTable = (e) => {
    e.preventDefault();
    if (tableName.trim()) {
      const newTable = addTable(tableName.trim());
      setTableName('');
      setShowNewTable(false);
      navigate(`/table/${newTable.id}`);
    }
  };

  return (
    <div>
      {profile.name && (
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 flex-shrink-0 rounded-lg border border-gray-200 bg-white flex items-center justify-center overflow-hidden">
            {profile.logo ? (
              <img src={profile.logo} alt={profile.name} className="h-full w-full object-cover" />
            ) : (
              <Utensils className="h-5 w-5 text-indigo-600" />
            )}
          </div>
          <span className="text-lg font-semibold text-gray-900">{profile.name}</span>
        </div>
      )}
      <div className="flex flex-wrap justify-between items-center gap-3 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Tavoli Attivi</h1>
        <button
          onClick={() => setShowNewTable(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nuovo Tavolo
        </button>
      </div>

      {showNewTable && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <form onSubmit={handleCreateTable}>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={tableName}
                onChange={(e) => setTableName(e.target.value)}
                placeholder="Nome tavolo (es. Tavolo 1)"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                autoFocus
              />
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 sm:flex-initial px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Crea
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewTable(false)}
                  className="flex-1 sm:flex-initial px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Annulla
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {tables.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
          <Utensils className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">Nessun tavolo attivo</h3>
          <p className="text-gray-500 mb-4">Crea un nuovo tavolo per iniziare a prendere ordini</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tables.map(table => (
            <Link
              key={table.id}
              to={`/table/${table.id}`}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-indigo-300 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">{table.name}</h3>
                <span className="bg-indigo-100 text-indigo-700 text-xs font-medium px-2 py-1 rounded-full">
                  {table.orders.length} ordini
                </span>
              </div>
              <div className="flex items-center text-gray-600 mb-2">
                <Euro className="h-4 w-4 mr-1" />
                <span className="text-lg font-semibold">{getTableTotal(table.id).toFixed(2)}</span>
              </div>
              <p className="text-sm text-gray-500">
                Creato: {new Date(table.createdAt).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
