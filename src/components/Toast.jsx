import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion"; // eslint-disable-line no-unused-vars
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import ToastContext from "../context/ToastContext.js";

const toastStyles = {
  success: {
    icon: CheckCircle,
    iconColor: "text-green-500",
    bg: "bg-card",
    border: "border-l-4 border-l-green-500",
    shadow: "shadow-lg",
  },
  error: {
    icon: AlertCircle,
    iconColor: "text-destructive",
    bg: "bg-card",
    border: "border-l-4 border-l-destructive",
    shadow: "shadow-lg",
  },
  info: {
    icon: Info,
    iconColor: "text-primary",
    bg: "bg-card",
    border: "border-l-4 border-l-primary",
    shadow: "shadow-lg",
  },
};

function ToastItem({ type = "info", title, message, onClose }) {
  const styles = toastStyles[type] || toastStyles.info;
  const Icon = styles.icon;

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={twMerge(
        clsx(
          "pointer-events-auto flex items-start gap-3 p-4 rounded-xl min-w-[300px] max-w-[400px]",
          styles.bg,
          styles.border,
          styles.shadow
        )
      )}
    >
      <Icon className={clsx("w-5 h-5 shrink-0 mt-0.5", styles.iconColor)} />
      <div className="flex-1 min-w-0">
        {title && (
          <p className="font-semibold text-foreground text-sm">{title}</p>
        )}
        {message && (
          <p className={clsx("text-muted-foreground text-sm", !title && "font-medium")}>
            {message}
          </p>
        )}
      </div>
      <button
        onClick={onClose}
        className="shrink-0 p-1 rounded-lg hover:bg-muted transition-colors"
      >
        <X className="w-4 h-4 text-muted-foreground" />
      </button>
    </motion.div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ type = "info", title, message, duration = 4000 }) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, type, title, message }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toastSuccess = useCallback(
    (options) => addToast({ type: "success", ...options }),
    [addToast]
  );

  const toastError = useCallback(
    (options) => addToast({ type: "error", ...options }),
    [addToast]
  );

  const toastInfo = useCallback(
    (options) => addToast({ type: "info", ...options }),
    [addToast]
  );

  return (
    <ToastContext.Provider value={{ toast: addToast, removeToast, toastSuccess, toastError, toastInfo }}>
      {children}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map((item) => (
            <ToastItem key={item.id} {...item} onClose={() => removeToast(item.id)} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export default ToastProvider;
