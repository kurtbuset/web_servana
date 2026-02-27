import React from "react";

/**
 * PanelStyles - Inline styles for scrollbar and animations
 */
export function PanelStyles({ isDark }) {
  return (
    <style key={`scrollbar-${isDark ? 'dark' : 'light'}`} dangerouslySetInnerHTML={{
      __html: `
        .department-panel-scrollbar::-webkit-scrollbar {
          width: 6px !important;
        }
        .department-panel-scrollbar::-webkit-scrollbar-track {
          background: transparent !important;
        }
        .department-panel-scrollbar::-webkit-scrollbar-thumb {
          background: ${isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'} !important;
          border-radius: 3px !important;
        }
        .department-panel-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'} !important;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: translate(-50%, -50%) scale(0.9); opacity: 0; }
          to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
        @keyframes slideInRight {
          from { 
            opacity: 0;
            transform: translateY(-50%) translateX(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(-50%) translateX(0);
          }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        .animate-scaleIn { animation: scaleIn 0.2s ease-out; }
        .animate-slideInRight { animation: slideInRight 0.2s ease-out; }
      `
    }} />
  );
}
