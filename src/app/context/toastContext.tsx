import { createContext, useState, useCallback } from "react";
import { v4 as uuid } from "uuid"; // install this package to generate unique keys
import Toast from "@/components/base/toast";
import { AnimatePresence } from "framer-motion";

type ToastContextProps = {
  showToast: (message: string) => boolean | JSX.Element;
};

export const ToastContext = createContext<Partial<ToastContextProps>>({
  showToast: () => false,
});

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<{ id: string; message: string }[]>([]);

  const showToast = useCallback((message: string): boolean | JSX.Element => {
    const id = uuid();
    setToasts((oldToasts) => [...oldToasts, { id, message }]);

    setTimeout(() => {
      setToasts((oldToasts) => oldToasts.filter((toast) => toast.id !== id));
    }, 2000);
    return true;
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-0 right-0 flex flex-col p-4">
        <AnimatePresence>
          {toasts.map((toast) => (
            <Toast key={toast.id} message={toast.message} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
