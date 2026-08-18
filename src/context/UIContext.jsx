import React, { createContext, useContext, useState, useRef } from "react";

const UIContext = createContext(null);

export function UIProvider({ children }) {
  const [toast, setToast] = useState("");
  const timerRef = useRef(null);

  function notify(message) {
    setToast(message);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setToast(""), 2200);
  }

  return (
    <UIContext.Provider value={{ notify, toast }}>
      {children}
      {toast && <div className="toast">{toast}</div>}
    </UIContext.Provider>
  );
}

export function useUI() {
  return useContext(UIContext);
}
