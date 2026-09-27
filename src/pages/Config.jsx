import { useState } from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { useConfirm } from '../hooks/useConfirm';
import ProductFormModal from '../components/ProductFormModal';

export default function Config() {
  const { products, addProduct, updateProduct, deleteProduct, getCategories } = useProducts();
  const confirm = useConfirm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const handleNewProduct = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleDelete = async (productId) => {
    if (await confirm('Sei sicuro di voler eliminare questo prodotto?')) {
      deleteProduct(productId);
    }
  };

  const categories = getCategories();

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-3 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Configurazione Menu</h1>
        <button
          onClick={handleNewProduct}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nuovo Prodotto
        </button>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
          <h3 className="text-xl font-medium text-gray-900 mb-2">Nessun prodotto configurato</h3>
          <p className="text-gray-500 mb-4">Aggiungi prodotti al menu per iniziare</p>
        </div>
      ) : (
        <div className="space-y-6">
          {categories.map(category => (
            <div key={category} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 capitalize">{category}</h2>
              <div className="space-y-3">
                {products
                  .filter(p => p.category === category)
                  .map(product => (
                    <div
                      key={product.id}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div>
                        <div className="font-medium text-gray-900">{product.name}</div>
                        <div className="text-indigo-600 font-semibold">€{product.price.toFixed(2)}</div>
                      </div>
                      <div className="flex gap-2 self-end sm:self-auto">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Modifica"
                        >
                          <Edit2 className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Elimina"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <ProductFormModal
          isOpen={isModalOpen}
          product={editingProduct}
          products={products}
          onClose={handleCloseModal}
          onAddProduct={addProduct}
          onUpdateProduct={updateProduct}
        />
      )}
    </div>
  );
}
