import { useLocalStorage } from './useLocalStorage';

export function useProducts() {
  const [products, setProducts] = useLocalStorage('bar_products', []);

  const addProduct = (product) => {
    const newProduct = {
      id: Date.now().toString(),
      ...product,
      variants: product.variants || []
    };
    setProducts([...products, newProduct]);
    return newProduct;
  };

  const updateProduct = (productId, updates) => {
    setProducts(products.map(product =>
      product.id === productId
        ? { ...product, ...updates }
        : product
    ));
  };

  const deleteProduct = (productId) => {
    setProducts(products.filter(product => product.id !== productId));
  };

  const getProductsByCategory = (category) => {
    return products.filter(product => product.category === category);
  };

  const getCategories = () => {
    return [...new Set(products.map(product => product.category))];
  };

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductsByCategory,
    getCategories
  };
}
