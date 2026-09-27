import { useCallback, useRef, useState } from 'react';
import ConfirmDialog from '../components/ConfirmDialog';
import { ConfirmContext } from '../hooks/useConfirm';

export function ConfirmProvider({ children }) {
  const [dialog, setDialog] = useState({ isOpen: false, message: '' });
  const resolveRef = useRef(null);

  const confirm = useCallback((message) => {
    return new Promise((resolve) => {
      resolveRef.current = resolve;
      setDialog({ isOpen: true, message });
    });
  }, []);

  const handleConfirm = () => {
    setDialog({ isOpen: false, message: '' });
    resolveRef.current?.(true);
  };

  const handleCancel = () => {
    setDialog({ isOpen: false, message: '' });
    resolveRef.current?.(false);
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      <ConfirmDialog
        isOpen={dialog.isOpen}
        message={dialog.message}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </ConfirmContext.Provider>
  );
}
