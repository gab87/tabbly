import { useLocalStorage } from './useLocalStorage';

export function useTables() {
  const [tables, setTables] = useLocalStorage('bar_tables', []);
  const [history, setHistory] = useLocalStorage('bar_history', []);

  const addTable = (name) => {
    const newTable = {
      id: Date.now().toString(),
      name,
      orders: [],
      createdAt: new Date().toISOString(),
      status: 'active'
    };
    setTables([...tables, newTable]);
    return newTable;
  };

  const addOrder = (tableId, product) => {
    const order = {
      id: Date.now().toString(),
      productId: product.id,
      productName: product.name,
      price: product.price,
      category: product.category,
      variant: product.variant || null,
      timestamp: new Date().toISOString()
    };
    setTables(tables.map(table => 
      table.id === tableId 
        ? { ...table, orders: [...table.orders, order] }
        : table
    ));
  };

  const removeOrder = (tableId, orderId) => {
    setTables(tables.map(table =>
      table.id === tableId
        ? { ...table, orders: table.orders.filter(order => order.id !== orderId) }
        : table
    ));
  };

  const closeTable = (tableId) => {
    const table = tables.find(t => t.id === tableId);
    if (table) {
      const total = table.orders.reduce((sum, order) => sum + order.price, 0);
      const closedTable = {
        ...table,
        status: 'closed',
        total,
        closedAt: new Date().toISOString()
      };
      setHistory([closedTable, ...history]);
      setTables(tables.filter(t => t.id !== tableId));
    }
  };

  const renameTable = (tableId, newName) => {
    setTables(tables.map(table =>
      table.id === tableId
        ? { ...table, name: newName }
        : table
    ));
  };

  const deleteTable = (tableId) => {
    setTables(tables.filter(t => t.id !== tableId));
  };

  const getTableTotal = (tableId) => {
    const table = tables.find(t => t.id === tableId);
    return table ? table.orders.reduce((sum, order) => sum + order.price, 0) : 0;
  };

  const deleteFromHistory = (entryId) => {
    setHistory(history.filter(h => h.id !== entryId));
  };

  const deleteHistoryByDate = (date) => {
    const targetDate = new Date(date).toDateString();
    setHistory(history.filter(h => new Date(h.closedAt).toDateString() !== targetDate));
  };

  return {
    tables,
    history,
    addTable,
    addOrder,
    removeOrder,
    closeTable,
    renameTable,
    deleteTable,
    getTableTotal,
    deleteFromHistory,
    deleteHistoryByDate
  };
}
