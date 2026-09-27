import { useState } from 'react';
import { Clock, Euro, Calendar, Trash2, Trash } from 'lucide-react';
import { useTables } from '../hooks/useTables';
import { useConfirm } from '../hooks/useConfirm';

export default function GlobalHistory() {
  const { history, deleteFromHistory, deleteHistoryByDate } = useTables();
  const confirm = useConfirm();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

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

  // Filter history by selected date
  const filteredHistory = history.filter(entry => {
    const entryDate = new Date(entry.closedAt).toISOString().split('T')[0];
    return entryDate === selectedDate;
  });

  // Group filtered history by date (for display)
  const groupedByDate = filteredHistory.reduce((acc, entry) => {
    const dateKey = new Date(entry.closedAt).toDateString();
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(entry);
    return acc;
  }, {});

  const handleDeleteEntry = async (entryId) => {
    if (await confirm('Sei sicuro di voler eliminare questo tavolo dallo storico?')) {
      deleteFromHistory(entryId);
    }
  };

  const handleDeleteDay = async () => {
    if (await confirm(`Sei sicuro di voler eliminare tutti i tavoli del ${new Date(selectedDate).toLocaleDateString('it-IT')}?`)) {
      deleteHistoryByDate(selectedDate);
    }
  };

  if (history.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
        <Clock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-medium text-gray-900 mb-2">Nessuno storico disponibile</h3>
        <p className="text-gray-500">Chiudi dei tavoli per vedere qui lo storico degli ordini</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Storico Tavoli</h1>
        <button
          onClick={handleDeleteDay}
          disabled={filteredHistory.length === 0}
          className={`flex items-center justify-center px-4 py-2 rounded-lg transition-colors ${
            filteredHistory.length === 0
              ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
              : 'bg-red-600 text-white hover:bg-red-700'
          }`}
        >
          <Trash className="h-5 w-5 mr-2" />
          Elimina giornata
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Seleziona data</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
        />
      </div>

      {filteredHistory.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
          <Clock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">Nessun tavolo per questa data</h3>
          <p className="text-gray-500">Seleziona un'altra data per vedere lo storico</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedByDate).map(([dateKey, entries]) => (
            <div key={dateKey}>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {new Date(dateKey).toLocaleDateString('it-IT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </h2>
              <div className="space-y-4">
                {entries.map((entry, index) => {
                  const cumulativeOrders = getCumulativeOrders(entry.orders);
                  return (
                    <div
                      key={`${entry.id}-${index}`}
                      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{entry.name}</h3>
                          <div className="flex items-center text-gray-500 text-sm mt-1">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>Chiuso: {new Date(entry.closedAt).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-4">
                          <div className="flex items-center">
                            <Euro className="h-5 w-5 mr-1 text-indigo-600" />
                            <span className="text-2xl font-bold text-indigo-600">€{entry.total.toFixed(2)}</span>
                          </div>
                          <button
                            onClick={() => handleDeleteEntry(entry.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Elimina tavolo"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 pt-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Ordini ({entry.orders.length})</h4>
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
                              </div>
                              <div className="text-indigo-600 font-medium">€{group.total.toFixed(2)}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
