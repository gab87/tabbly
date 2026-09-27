import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, X, Check, Edit2, Save, Minus } from 'lucide-react';
import { useTables } from '../hooks/useTables';
import { useProducts } from '../hooks/useProducts';
import OrderModal from '../components/OrderModal';
import { useConfirm } from '../hooks/useConfirm';

export default function TableDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tables, addOrder, removeOrder, closeTable, getTableTotal, renameTable } = useTables();
  const { products } = useProducts();
  const confirm = useConfirm();
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState('');

  const table = tables.find(t => t.id === id);

  if (!table) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-medium text-gray-900 mb-4">Tavolo non trovato</h2>
        <Link to="/" className="text-indigo-600 hover:text-indigo-700">
          Torna ai tavoli
        </Link>
      </div>
    );
  }

  const handleCloseTable = async () => {
    if (await confirm(`Chiudere il tavolo ${table.name}? Il totale è €${getTableTotal(id).toFixed(2)}`)) {
      closeTable(id);
      navigate('/');
    }
  };

  const handleStartEditName = () => {
    setEditedName(table.name);
    setIsEditingName(true);
  };

  const handleSaveName = () => {
    if (editedName.trim()) {
      renameTable(id, editedName.trim());
      setIsEditingName(false);
    }
  };

  const handleCancelEditName = () => {
    setIsEditingName(false);
    setEditedName('');
  };

  // Group orders by product name and variant for cumulative view
  const getCumulativeOrders = () => {
    const grouped = {};
    table.orders.forEach(order => {
      const key = `${order.productName.toLowerCase()}-${order.variant || 'base'}`;
      if (!grouped[key]) {
        grouped[key] = {
          productName: order.productName,
          variant: order.variant,
          category: order.category,
          price: order.price,
          count: 0,
          orderIds: [],
          total: 0
        };
      }
      grouped[key].count += 1;
      grouped[key].orderIds.push(order.id);
      grouped[key].total += order.price;
    });
    return Object.values(grouped);
  };

  const cumulativeOrders = getCumulativeOrders();

  const handleIncrement = (group) => {
    const product = products.find(p => p.name.toLowerCase() === group.productName.toLowerCase());
    if (product) {
      if (group.variant) {
        const variant = product.variants?.find(v => v.name === group.variant);
        if (variant) {
          addOrder(id, {
            ...product,
            variant: variant.name,
            price: product.price + variant.priceSurcharge
          });
        }
      } else {
        addOrder(id, product);
      }
    }
  };

  const handleDecrement = (group) => {
    // Remove only one order (the last one added)
    const lastOrderId = group.orderIds[group.orderIds.length - 1];
    removeOrder(id, lastOrderId);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <Link to="/" className="flex items-center text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Torna ai tavoli
        </Link>
        <div className="grid grid-cols-2 sm:flex sm:flex-row gap-2 sm:gap-3">
          <Link
            to={`/table/${id}/history`}
            className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors col-span-2 sm:col-auto"
          >
            Storico
          </Link>
          <button
            onClick={() => setShowOrderModal(true)}
            className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Aggiungi Ordine
          </button>
          <button
            onClick={handleCloseTable}
            className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Check className="h-5 w-5 mr-2" />
            Chiudi Tavolo
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            {isEditingName ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="text-3xl font-bold text-gray-900 border-2 border-indigo-500 rounded-lg px-3 py-2 outline-none"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveName();
                    if (e.key === 'Escape') handleCancelEditName();
                  }}
                />
                <button
                  onClick={handleSaveName}
                  className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  title="Salva"
                >
                  <Save className="h-5 w-5" />
                </button>
                <button
                  onClick={handleCancelEditName}
                  className="p-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  title="Annulla"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{table.name}</h1>
                <button
                  onClick={handleStartEditName}
                  className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  title="Rinomina tavolo"
                >
                  <Edit2 className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
          <div className="sm:text-right">
            <div className="text-sm text-gray-500">Totale</div>
            <div className="text-2xl sm:text-3xl font-bold text-indigo-600">€{getTableTotal(id).toFixed(2)}</div>
          </div>
        </div>

        {table.orders.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            Nessun ordine ancora. Clicca "Aggiungi Ordine" per iniziare.
          </div>
        ) : (
          <div className="space-y-3">
            {cumulativeOrders.map((group, index) => (
              <div
                key={`cumulative-${index}`}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{group.productName}</div>
                  {group.variant && (
                    <div className="text-sm text-indigo-600 font-medium">{group.variant}</div>
                  )}
                  <div className="text-sm text-gray-500 capitalize">{group.category}</div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDecrement(group)}
                      className="p-2.5 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-lg transition-colors"
                      title="Diminuisci quantità"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center font-semibold text-gray-900">{group.count}</span>
                    <button
                      onClick={() => handleIncrement(group)}
                      className="p-2.5 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors"
                      title="Aumenta quantità"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="text-lg font-semibold text-indigo-600 w-20 sm:w-24 text-right">€{group.total.toFixed(2)}</div>
                  <button
                    onClick={async () => {
                      if (await confirm(`Rimuovere tutti i ${group.count} ordini di "${group.productName}"?`)) {
                        group.orderIds.forEach(orderId => removeOrder(id, orderId));
                      }
                    }}
                    className="p-2.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Rimuovi tutti gli ordini"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <OrderModal
        isOpen={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        products={products}
        onAddOrder={(product) => {
          addOrder(id, product);
        }}
      />
    </div>
  );
}
