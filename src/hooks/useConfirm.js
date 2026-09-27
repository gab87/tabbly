import { createContext, useContext } from 'react';

export const ConfirmContext = createContext(null);

export function useConfirm() {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm deve essere usato all\'interno di un ConfirmProvider');
  }
  return context.confirm;
}
