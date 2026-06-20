import { createContext, useState, useEffect, useCallback } from 'react';

export const ModeContext = createContext(null);

export const ModeProvider = ({ children }) => {
  const [isSellerMode, setIsSellerMode] = useState(() => {
    return localStorage.getItem('gigvera_mode') === 'seller';
  });

  const toggleMode = useCallback(() => {
    setIsSellerMode((prev) => {
      const next = !prev;
      localStorage.setItem('gigvera_mode', next ? 'seller' : 'buyer');
      return next;
    });
  }, []);

  const setMode = useCallback((mode) => {
    const next = mode === 'seller';
    setIsSellerMode(next);
    localStorage.setItem('gigvera_mode', next ? 'seller' : 'buyer');
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('gigvera_mode');
    if (stored === 'seller' || stored === 'buyer') {
      setIsSellerMode(stored === 'seller');
    }
  }, []);

  return (
    <ModeContext.Provider value={{ isSellerMode, toggleMode, setMode }}>
      {children}
    </ModeContext.Provider>
  );
};
