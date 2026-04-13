import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

const ToastContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const hideTimers = useRef(new Map());

  const removeToast = useCallback((id) => {
    if (hideTimers.current.has(id)) {
      clearTimeout(hideTimers.current.get(id));
      hideTimers.current.delete(id);
    }
    setToasts((prev) => prev.map(t => t.id === id ? { ...t, hiding: true } : t));
    setTimeout(() => {
      setToasts((prev) => prev.filter(t => t.id !== id));
    }, 300); // Wait for the animation
  }, []);

  const addToast = useCallback((title, message, type = 'info') => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, title, message, type }]);

    const timer = setTimeout(() => {
      removeToast(id);
    }, 6000);
    hideTimers.current.set(id, timer);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div id="toast-container">
        {toasts.map((toast) => {
          let icon = 'ℹ️';
          if (toast.type === 'danger') icon = '🚨';
          if (toast.type === 'warning') icon = '⚠️';

          return (
            <div key={toast.id} className={`toast toast-${toast.type} ${toast.hiding ? 'hiding' : ''}`}>
              <div className="toast-icon">{icon}</div>
              <div className="toast-content">
                <div className="toast-title">{toast.title}</div>
                <div className="toast-message">{toast.message}</div>
              </div>
              <button className="toast-close" onClick={() => removeToast(toast.id)}>&times;</button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};
