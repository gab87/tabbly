import { X } from 'lucide-react';

export default function VariantModal({ isOpen, onClose, product, onVariantSelect }) {
  if (!isOpen || !product) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Seleziona Variante</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        <div className="p-4">
          <p className="text-gray-600 mb-4">Seleziona una variante per <span className="font-semibold text-gray-900">{product.name}</span>:</p>
          <div className="space-y-2">
            {product.variants.map((variant, index) => (
              <button
                key={index}
                onClick={() => onVariantSelect(product, variant)}
                className="w-full p-4 min-h-[56px] border border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 active:bg-indigo-50 transition-all text-left"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">{variant.name}</span>
                  <span className="text-indigo-600 font-semibold">
                    {variant.priceSurcharge >= 0 ? '+' : ''}€{variant.priceSurcharge.toFixed(2)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
