import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, Euro, Trash2 } from 'lucide-react';
import { useTables } from '../hooks/useTables';
import { useConfirm } from '../hooks/useConfirm';

export default function TableHistory() {
  const { id } = useParams();
  const { history, deleteFromHistory } = useTables();
  const confirm = useConfirm();

  const tableHistory = history.filter(h => h.id === id);

  // Helper function to group orders by product name and variant
  const getCumulativeOrders = (orders) => {
    const grouped = {};
    orders.forEach(order => {
      const key = `${order.productName.toLowerCase()}-${order.variant || 'base'}`;
      if (!grouped[key]) {
        grouped[key] = {
          productName: order.productName,
          variant: order.variant,
          category: order.category,
          price: order.price,
          count: 0,
          total: 0
        };
      }
      grouped[key].count += 1;
      grouped[key].total += order.price;
    });
    return Object.values(grouped);
  };

  if (tableHistory.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-medium text-gray-900 mb-4">Nessuno storico trovato per questo tavolo</h2>
        <Link to="/" className="text-indigo-600 hover:text-indigo-700">
          Torna ai tavoli
        </Link>
      </div>
    );
  }

  const latestEntry = tableHistory[0];

  const handleDeleteEntry = async (entryId) => {
    if (await confirm('Sei sicuro di voler eliminare questo storico del tavolo?')) {
      deleteFromHistory(entryId);
    }
  };

  return (
    <div>
      <Link to={`/table/${id}`} className="flex items-center text-gray-600 hover:text-gray-900 mb-8">
        <ArrowLeft className="h-5 w-5 mr-2" />
        Torna al tavolo
      </Link>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Storico: {latestEntry.name}</h1>
        <p className="text-gray-500 mb-6">
          Chiuso il: {new Date(latestEntry.closedAt).toLocaleString('it-IT')}
        </p>

        {tableHistory.map((entry, index) => {
          const cumulativeOrders = getCumulativeOrders(entry.orders);
          return (
            <div key={`${entry.id}-${index}`} className="border-t border-gray-200 pt-6 mt-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div className="flex items-center text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{new Date(entry.closedAt).toLocaleString('it-IT')}</span>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <div className="flex items-center">
                    <Euro className="h-4 w-4 mr-1 text-indigo-600" />
                    <span className="text-xl font-bold text-indigo-600">€{entry.total.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteEntry(entry.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Elimina storico"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {cumulativeOrders.map((group, idx) => (
                  <div
                    key={`group-${idx}`}
                    className="flex flex-wrap items-center justify-between gap-2 p-3 bg-gray-50 rounded-lg text-sm"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-gray-900">{group.productName}</span>
                      {group.variant && (
                        <span className="text-indigo-600 font-medium text-xs">({group.variant})</span>
                      )}
                      <span className="bg-indigo-100 text-indigo-700 text-xs font-medium px-2 py-1 rounded-full">
                        x{group.count}
                      </span>
                      <span className="text-gray-500 capitalize">({group.category})</span>
                    </div>
                    <div className="text-indigo-600 font-medium">€{group.total.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
