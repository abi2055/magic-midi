import React, { useEffect } from "react";

interface ToastProps {
  message: string | null;
  onClose: () => void;
  type?: "error" | "success";
}

export const Toast: React.FC<ToastProps> = ({ message, onClose, type = "error" }) => {
  // Auto-dismiss after 4 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor: type === "error" ? "rgba(255, 82, 82, 0.95)" : "rgba(76, 175, 80, 0.95)",
        color: "white",
        padding: "10px 20px",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        zIndex: 10000, // Top of the world
        display: "flex",
        alignItems: "center",
        gap: "10px",
        fontFamily: "Inter, sans-serif",
        fontSize: "14px",
        fontWeight: 500,
        backdropFilter: "blur(4px)",
        animation: "slideDown 0.3s ease-out",
        cursor: "pointer"
      }}
      onClick={onClose}
    >
      <span>{type === "error" ? "⚠️" : "✅"}</span>
      <span>{message}</span>
      
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translate(-50%, -20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </div>
  );
};

// Toast pop up on api errors specifically in place for error 503 from Gemini API