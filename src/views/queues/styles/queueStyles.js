/**
 * queueStyles - Inline styles for QueuesScreen
 */
export const getQueueStyles = () => `
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #d1d5db transparent;
  }
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(229, 231, 235, 0.3);
    border-radius: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #d1d5db;
    border-radius: 4px;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: #a1a1aa;
  }
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .animate-slide-in {
    animation: slideIn 0.3s ease-out;
  }
`;
