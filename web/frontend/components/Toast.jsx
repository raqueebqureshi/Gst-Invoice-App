import React, { useState } from "react";

const Toast = ({ message, type = "success", onClose }) => {
  if (!message) return null;

  const styles = {
    container: {
      position: "fixed",
      bottom: "20px",
      right: "20px",
      padding: "10px 20px",
      borderRadius: "5px",
      color: "#fff",
      fontSize: "14px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      zIndex: 9999,
      animation: "fadeInOut 3s ease-out",
    },
    success: { backgroundColor: "#28a745" },
    error: { backgroundColor: "#dc3545" },
    warning: { backgroundColor: "#ffc107", color: "#000" },
    info: { backgroundColor: "#17a2b8" },
  };

  return (
    <>
      <style>
        {`
          @keyframes fadeInOut {
            0% {
              opacity: 0;
              transform: translateY(10px);
            }
            10% {
              opacity: 1;
              transform: translateY(0);
            }
            90% {
              opacity: 1;
              transform: translateY(0);
            }
            100% {
              opacity: 0;
              transform: translateY(10px);
            }
          }
        `}
      </style>
      <div
        style={{
          ...styles.container,
          ...styles[type],
        }}
        onClick={onClose} // Close toast on click
      >
        {message}
      </div>
    </>
  );
};

export const useSimpleToast = () => {
  const [toast, setToast] = useState({ message: null, type: "success" });

  const showToast = (message, type = "success", duration = 3000) => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: null }), duration);
  };

  const ToastComponent = () => (
    <Toast
      message={toast.message}
      type={toast.type}
      onClose={() => setToast({ message: null })}
    />
  );

  return { showToast, ToastComponent };
};
