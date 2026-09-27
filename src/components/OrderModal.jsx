import { useState } from 'react';
import { X } from 'lucide-react';
import VariantModal from './VariantModal';

export default function OrderModal({ isOpen, onClose, products, onAddOrder }) {
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  if (!isOpen) return null;

  const categories = [...new Set(products.map(p => p.category))];

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleProductClick = (product) => {
    if (product.variants && product.variants.length > 0) {
      setSelectedProduct(product);
      setShowVariantModal(true);
    } else {
      onAddOrder(product);
    }
  };

  const handleVariantSelect = (product, variant) => {
    const productWithVariant = {
      ...product,
      variant: variant.name,
      price: product.price + variant.priceSurcharge
    };
    onAddOrder(productWithVariant);
    setShowVariantModal(false);
    setSelectedProduct(null);
  };

  const handleVariantModalClose = () => {
    setShowVariantModal(false);
    setSelectedProduct(null);
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Aggiungi Ordine</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        <div className="p-4 overflow-y-auto max-h-[60vh]">
          {categories.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Nessun prodotto configurato. Vai in Config per aggiungere prodotti.
            </p>
          ) : (
            categories.map(category => (
              <div key={category} className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3 capitalize">{category}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {products
                    .filter(p => p.category === category)
                    .map(product => (
                      <button
                        key={product.id}
                        onClick={() => handleProductClick(product)}
                        className="p-4 min-h-[72px] border border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 active:bg-indigo-50 transition-all text-left"
                      >
                        <div className="font-medium text-gray-900">{product.name}</div>
                        <div className="text-indigo-600 font-semibold">€{product.price.toFixed(2)}</div>
                        {product.variants && product.variants.length > 0 && (
                          <div className="text-xs text-gray-500 mt-1">
                            {product.variants.length} variant{product.variants.length > 1 ? 'i' : 'e'}
                          </div>
                        )}
                      </button>
                    ))}
                </div>
              </div>
            ))
          )}
        </div>
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Chiudi
          </button>
        </div>
      </div>
      
      <VariantModal
        isOpen={showVariantModal}
        onClose={handleVariantModalClose}
        product={selectedProduct}
        onVariantSelect={handleVariantSelect}
      />
    </div>
  );
}
