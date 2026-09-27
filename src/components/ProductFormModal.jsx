import { useState } from 'react';
import { X, Save, Plus } from 'lucide-react';
import { useToast } from '../hooks/useToast';

const emptyFormData = { name: '', price: '', category: '', variants: [] };

const buildInitialFormData = (product) =>
  product
    ? {
        name: product.name,
        price: product.price.toString(),
        category: product.category,
        variants: product.variants || []
      }
    : emptyFormData;

export default function ProductFormModal({ isOpen, product, products, onClose, onAddProduct, onUpdateProduct }) {
  const { showToast } = useToast();
  const [formData, setFormData] = useState(() => buildInitialFormData(product));
  const [newVariant, setNewVariant] = useState({ name: '', priceSurcharge: '' });

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleAddVariant = () => {
    if (newVariant.name.trim() && newVariant.priceSurcharge !== '') {
      setFormData({
        ...formData,
        variants: [...formData.variants, { name: newVariant.name.trim(), priceSurcharge: parseFloat(newVariant.priceSurcharge) }]
      });
      setNewVariant({ name: '', priceSurcharge: '' });
    }
  };

  const handleRemoveVariant = (index) => {
    setFormData({
      ...formData,
      variants: formData.variants.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProductData = {
      name: formData.name.trim(),
      price: parseFloat(formData.price),
      category: formData.category.toLowerCase(),
      variants: formData.variants
    };

    // Check for duplicate names (excluding current product when editing)
    const isDuplicate = products.some(
      p => p.name.toLowerCase() === newProductData.name.toLowerCase() && p.id !== product?.id
    );

    if (isDuplicate) {
      showToast('Esiste già un prodotto con questo nome. I nomi devono essere unici.', 'error');
      return;
    }

    if (product) {
      onUpdateProduct(product.id, newProductData);
    } else {
      onAddProduct(newProductData);
    }

    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[85vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {product ? 'Modifica Prodotto' : 'Nuovo Prodotto'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-4 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prezzo (€)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="es. bevande, cibo"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  required
                />
              </div>
            </div>

            {/* Variants Section */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Varianti (opzionale)</label>
              <div className="space-y-2 mb-3">
                {formData.variants.map((variant, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                    <span className="flex-1 font-medium text-gray-900">{variant.name}</span>
                    <span className="text-indigo-600 font-medium">
                      {variant.priceSurcharge >= 0 ? '+' : ''}€{variant.priceSurcharge.toFixed(2)}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveVariant(index)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={newVariant.name}
                  onChange={(e) => setNewVariant({ ...newVariant, name: e.target.value })}
                  placeholder="Nome variante (es. prosecco)"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                />
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.01"
                    value={newVariant.priceSurcharge}
                    onChange={(e) => setNewVariant({ ...newVariant, priceSurcharge: e.target.value })}
                    placeholder="Maggiorazione (€)"
                    className="flex-1 sm:w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleAddVariant}
                    className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              className="flex items-center justify-center px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Save className="h-4 w-4 mr-2" />
              {product ? 'Aggiorna' : 'Salva'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annulla
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
