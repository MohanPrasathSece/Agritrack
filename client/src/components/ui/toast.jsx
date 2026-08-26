import React from 'react';

const Toast = ({ toast, onDismiss }) => {
  const getVariantStyles = (variant) => {
    switch (variant) {
      case 'destructive':
        return 'bg-red-600 text-white';
      case 'success':
        return 'bg-green-600 text-white';
      default:
        return 'bg-white border border-gray-200 text-gray-900';
    }
  };

  return (
    <div className={`rounded-lg p-4 shadow-lg ${getVariantStyles(toast.variant)}`}>
      <div className="flex justify-between items-start">
        <div>
          {toast.title && (
            <div className="font-semibold mb-1">{toast.title}</div>
          )}
          {toast.description && (
            <div className="text-sm opacity-90">{toast.description}</div>
          )}
        </div>
        <button
          onClick={() => onDismiss(toast.id)}
          className="ml-4 text-lg leading-none opacity-70 hover:opacity-100"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export { Toast };
