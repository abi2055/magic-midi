import React from "react";

interface LoadingOverlayProps {
  isVisible: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div
      style={{
        position: "fixed",      // Fixed relative to the viewport
        top: 0,
        left: 0,
        width: "100vw",         // Full viewport width
        height: "100vh",        // Full viewport height
        backgroundColor: "rgba(0, 0, 0, 0.7)", // Dim the background
        backdropFilter: "blur(4px)",           // Add a nice blur effect
        zIndex: 9999,           // Ensure it sits on top of everything
        display: "flex",        // Center content
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        cursor: "wait",         // Indicate waiting state
      }}
      // Prevent clicks from passing through to the piano roll
      onMouseDown={(e) => e.stopPropagation()} 
      onClick={(e) => e.stopPropagation()}
    >
      {/* 1. THE SPINNER */}
      <div className="gemini-spinner" style={{ marginBottom: "24px" }} />

      {/* 2. THE TEXT */}
      <h2 style={{ 
        fontFamily: "Inter, sans-serif", 
        fontWeight: 600, 
        fontSize: "20px", 
        marginBottom: "12px" 
      }}>
        Composing...
      </h2>

      {/* Spinner Animation */}
      <style>{`
        .gemini-spinner {
          width: 50px;
          height: 50px;
          border: 4px solid rgba(136, 96, 208, 0.3);
          border-top: 4px solid #8860D0;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};